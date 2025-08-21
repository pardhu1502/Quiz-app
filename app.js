const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','ejs');

app.use(session({
  secret: 'quizsecret',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/quiz'));

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
