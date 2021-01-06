require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const jsonServer = require('json-server');
const router = jsonServer.router('data/db.json');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const user = require('./data/users.json');
const { stringify } = require('querystring');
const { json } = require('express');

const app = express();

app.listen(3000);

app.use('/api', router);
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"))
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});

app.get('/login', authenticateToken, (req, res) => {
    if (req.user) {
        res.redirect('/admin');
    } else {
        res.sendFile('./public/login.html', { root: __dirname });
    }
});

app.post('/login', async (req, res) => {
    const admin = user.users.find(o => o.name === req.body.username);
    if (admin) {
        const auth = await bcrypt.compare(req.body.password, admin.password);
        if (auth) {
            const accessToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET);
            res.cookie('jwt', accessToken, { httpOnly: true});
            return res.redirect('/admin');
        }
        throw Error('Incorrect password'); //return template literal?
    }
    throw Error('Incorrect email'); //return template literal?
});

app.get('/admin', authenticateToken, (req, res) => {
    if (req.user) {
        res.sendFile('./public/admin.html', { root: __dirname });
    } else {
        res.status(404).redirect('./login');
    }
});

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
    console.log(token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        //if (err) return res.redirect('./login');
        req.user = user
        next()
    });
}
app.use((req, res) => {
    res.status(404).sendFile('./public/404.html', { root: __dirname });
});