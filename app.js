require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');

const app = express();

app.listen(3000);

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"))
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
    console.log("working");
});

app.get('/login', (req, res) => {
    res.sendFile('./public/login.html', { root: __dirname });
});

app.post('/login', authenticateToken, (req, res) => {
    const { username, password } = req.body
    console.log(username);
    const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
    });
}
app.use((req, res) => {
    res.status(404).sendFile('./public/404.html', { root: __dirname });
});