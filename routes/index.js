var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

//Autoload de comandos con :quizId
router.param('quizId', quizController.load);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/author', quizController.author);	//cambio realizado en la rama creditos
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);

module.exports = router;
