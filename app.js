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
const nodemailer = require("nodemailer");
const { getMaxListeners } = require('process');

const app = express();

app.listen(3000);

app.use('/api', router);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"))
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(bodyParser.json());

// HOME PAGE

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});

// LOGIN PAGE

app.get('/login', /*authenticateLogin,*/ (req, res) => {
    // if (req.user) {
    //     res.redirect('/admin');
    // } else {
            res.sendFile('./public/login.html', { root: __dirname });
        }
        //res.sendFile('./public/login.html', { root: __dirname });
//    }
);

app.post('/login', async (req, res) => {
    const admin = user.users.find(o => o.name === req.body.username);
    if (admin) {
        const auth = await bcrypt.compare(req.body.password, admin.password);
        if (auth) {
            const accessToken = jwt.sign(admin, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
            const refreshToken = jwt.sign(admin, process.env.REFRESH_TOKEN_SECRET)
            res.cookie('accessToken', accessToken, { httpOnly: true}).cookie('refreshToken', refreshToken, { httpOnly: true});
            return res.status(200).send({redirect: '/admin'});
        } else {
            return res.status(401).send({error:'*Incorrect password'})
        }
    } else {
        return res.status(401).send({error: '*Incorrect username'})
    }
});

// CONTACT FORM

app.post('/send', async (req, res) => {
    console.log(req.body);
    const output = `
        <p>You have a new contact request...</p>
        <h3>Contact Details:</h3>
        <ul>
            <li>First Name: ${req.body.First_name}</li>
            <li>Last Name: ${req.body.Last_name}</li>
            <li>Email Address: ${req.body.Email_address}</li>
            <li>Telephone No: ${req.body.Telephone}</li>
        </ul>
        <h3>Message:</h3>
        <p>${req.body.message}</p>
    `
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'andykirby.uk@gmail.com',
          pass: process.env.EMAIL_PASS,
        },
        tls:{
            rejectUnauthorized:false
        }
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"NodeMailer" <andykirby.uk@gmail.com>', // sender address
        to: "info@andykirby.co.uk", // list of receivers
        subject: "Contact Request", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      res.send({sent:'Message sent'})
    });
    

// ADMIN PAGE

app.get('/admin', authenticateToken, (req, res) => {
        res.sendFile('./public/admin.html', { root: __dirname });
    }
);

// LOGOUT URL

app.get('/logout', (req, res) => {
    res.cookie('accessToken', '', { maxAge: 1 });
    res.redirect('/')
})

// AUTHENTICATE TOKEN

function authenticateToken(req, res, next) {
    const token = req.cookies.accessToken;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.redirect('/login');
            } else {
                console.log(user);
                next();
            }
        })
    }
    else {
        res.redirect('./login');
    }
}

// AUTHENTICATE TOKEN FOR LOGIN BYPASS

function authenticateLogin(req, res, next) {
    const token = req.cookies.jwt;
    console.log(token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        //if (err) return res.redirect('./login');
        req.user = user
        next()
    });
}
// ERROR 404: PAGE NOT FOUND

app.use((req, res) => {
    res.status(404).sendFile('./public/404.html', { root: __dirname });
});