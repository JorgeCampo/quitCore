var models = require('../models/models.js');

// MW que permite acciones solamente si el quiz objeto pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req, res, next){
    var objQuizOwner = req.quiz.UserId;
    var logUser = req.session.user.id;
    var isAdmin = req.session.user.isAdmin;

    if (isAdmin || objQuizOwner === logUser) {
        next();
    } else {
        res.redirect('/');
    }
};

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find({
			where: {id : Number(quizId)},
			include: [{model: models.Comment }]})
.then( function(quiz) {
      if(quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)) }
    }
  ).catch(function(error) {next(error)});
};

// GET /quizes
exports.index = function(req, res){

var q=req.query.search||"".replace(/\s/g,'%');
q='%'+q+'%';

models.Quiz.findAll({where: ["pregunta like ?", q], order: [['pregunta','ASC']]}).then(function(quizes){
       res.render('quizes/index.ejs', { quizes: quizes, errors: []});}
 	).catch(function(error) {next(error)}); 
};
// GET /users/:userId/quizes
exports.index = function(req, res) {  
  var options = {};
  if(req.user){
    options.where = {UserId: req.user.id}
  }
  
  models.Quiz.findAll(options).then(
    function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }
  ).catch(function(error){next(error)});
};
// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
  };

// GET /quizes/:id/answer
exports.answer = function(req, res) {
   var resultado = 'Incorrecto';
   if (req.query.respuesta === req.quiz.respuesta){
	resultado= 'Correcto';
    }
   res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};
   // GET /quizes/new

exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "", respuesta: ""}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  req.body.quiz.UserId = req.session.user.id;
	if(req.files.image){
    req.body.quiz.image = req.files.image.name;
	 }
  var quiz = models.Quiz.build( req.body.quiz );
   quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "UserId", "image"]})
        .then(function(){ res.redirect('/quizes')}) 
           // res.redirect: Redirección HTTP a lista de preguntas
	}
	}
	);  
 
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};


// PUT /quizes/:id
exports.update = function(req, res) {
	if(req.files.image){
   req.quiz.image = req.files.image.name;
  }
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "image"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

//GET /author'

exports.author = function(req, res){
	res.render('author', {alumno: 'GONZALO LÁZARO MACEÍN y JORGE CAMPO ÁVILA', errors: []});


};

// GET /quizes/statistics
exports.statistics = function(req, res) {
	var no_comments=0;
 	var con_comments=0;
	models.Comment.findAll({where:{publicado: true}}).then(function(comment){
  		models.Quiz.count().then(function(quizes){
		console.log ("llega aqui");
				for( j=1; j<quizes+1; j++){
				console.log ("valor de quizes[j]:" +quizes);
	 			for( i=0; i<comment.length ; i++){
					console.log ("valor de comment[i].Quizid:" +comment[i].QuizId );
	  				if (comment[i].QuizId === quizes-(quizes-j)){
						console.log( "valor de con_comennts" +no_comments );
						con_comments++;
                                	 }
	              	  	}
                	}
			no_comments = quizes-con_comments;
   		res.render('quizes/statistics', { no_comments: no_comments, con_comments: con_comments, 			quizes: quizes, comment: comment, quiz: req.quiz ,errors: []});
  	}
 	).catch(function(error) { next(error);})
	}
	).catch(function(error) { next(error);})
};




