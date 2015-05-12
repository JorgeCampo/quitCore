var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

//Autoload de comandos con :quizId
router.param('quizId', quizController.load);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/author', quizController.author);	//cambio realizado en la rama creditos

module.exports = router;
