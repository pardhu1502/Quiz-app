const express = require('express');
const quizController = require('../controllers/quizController');
const router = express.Router();

function isAuth(req,res,next){
    if(!req.session.userId) return res.redirect('/login');
    next();
}

router.get('/dashboard',isAuth,quizController.dashboard);
router.get('/quiz/start', isAuth, quizController.startQuiz);
router.post('/quiz/submit', isAuth, quizController.submitQuiz);
router.get('/quiz/result', isAuth, quizController.showResult);
router.get('/scores', isAuth, quizController.scoreHistory);

module.exports = router;
