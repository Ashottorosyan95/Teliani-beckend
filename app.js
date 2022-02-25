const express = require('express');
const router = require('./router/router.js');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');

app.use(cors());

app.set('views','views')
app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({secret:"+", resave:true, saveUninitialized:true}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());
app.use((req, res, next) => {
    res.locals.succ = req.flash("success_msg")
    res.locals.err = req.flash("error_msg")
    next()
})
app.use('/', router)


app.listen(port)