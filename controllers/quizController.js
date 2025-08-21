const db = require('../models/db');
const axios = require('axios');
let currentQuiz = [];

exports.dashboard = (req, res) => {
  db.query('SELECT COUNT(*) AS quizzes FROM scores WHERE user_id = ?', [req.session.userId],
    (err, rows) => {
      const quizzes = rows[0]?.quizzes || 0;
      res.render('dashboard', { name: req.session.userName, quizzes });
    });
};

exports.startQuiz = async (req, res) => {
  const resp = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple');
  currentQuiz = resp.data.results.map(q => ({
    question: q.question,
    correct: q.correct_answer,
    options: [...q.incorrect_answers, q.correct_answer]
      .sort(() => Math.random() - 0.5)
  }));
  res.render('quiz', { questions: currentQuiz });
};

exports.submitQuiz = (req, res) => {
  let score = 0;
  currentQuiz.forEach((q, i) => {
    if (req.body[`q${i}`] === q.correct) score++;
  });
  db.query('INSERT INTO scores (user_id, score, total) VALUES (?,?,?)',
    [req.session.userId, score, currentQuiz.length],
    err => err ? res.send('Error saving score') : res.redirect('/quiz/result'));
};

exports.showResult = (req, res) => {
  db.query('SELECT * FROM scores WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [req.session.userId],
    (err, rows) => res.render('result', { score: rows[0] }));
};

exports.scoreHistory = (req, res) => {
  db.query('SELECT * FROM scores WHERE user_id = ? ORDER BY created_at DESC', [req.session.userId],
    (err, rows) => res.render('scores', { history: rows }));
};