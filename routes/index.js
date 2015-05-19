var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
//Autoload de comandos con :quizId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

/* GET home page. */
router.get('/', sessionController.logout, function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});
// Definicion de rutas de sesion
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);



//Definicion de rutas de /quizes
router.get('/quizes',   quizController.index,  sessionController.logout);
router.get('/quizes/:quizId(\\d+)', quizController.show,  sessionController.logout);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer,  sessionController.logout);
router.get('/quizes/new', 		   sessionController.loginRequired, quizController.new,  sessionController.logout);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create,  sessionController.logout);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit,  sessionController.logout);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update,  sessionController.logout);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy,  sessionController.logout);

router.get('/author',                      sessionController.loginRequired, quizController.author,  sessionController.logout);//cambio realizado en la rama creditos

router.get('/quizes/statistics',          sessionController.loginRequired, quizController.statistics,  commentController.statistics,    sessionController.logout);
//Definicion de rutas de comentarios

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new,  sessionController.logout);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create,  sessionController.logout);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired,  commentController.publish,  sessionController.logout);


module.exports = router;
