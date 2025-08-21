const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const router = express.Router();

router.get('/',(req,res)=>res.redirect('/login'));
router.get('/register',(req,res)=>res.render('register'));
router.get('/login',(req,res)=>res.render('login'));

router.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;
    const hashed = await bcrypt.hash(password,10);
    db.query('INSERT INTO users (name,email,password) VALUES (?,?,?)',
        [name,email,hashed],
        err => err ? res.send('Registration error') : res.redirect('/login')

    );
});

router.post('/login',(req,res)=>{
    const{email,password}=req.body;
    db.query('SELECT * FROM users WHERE email = ?',[email], async (err,users)=>{
        if(err || users.length === 0)
            return res.send('Login failed');
        const user = users[0];
        if(!(await bcrypt.compare(password,user.password)))
            return res.send('Incorrect credentials');
        req.session.userId = user.id;
        req.session.userName = user.name;
        res.redirect('/dashboard');
    });
});

router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;