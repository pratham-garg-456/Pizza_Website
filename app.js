/********************************************************************************* 
*  WEB322 – Assignment 5 
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.   
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including web sites) or distributed to other students. 
*  
*  Name: ______Pratham Garg________________ Student ID: ___117900217___________ Date: ____12-12-2022____________
********************************************************************************/


const express = require('express')

const app = express()

app.set('view engine', 'ejs')

const session = require('express-session')

const userModel = require('./models/User')

const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')

app.use(express.static('public'))

const isAuth = require('./middleware/isAuth')

const MongoDBStore = require('connect-mongodb-session')(session);

const uri = "mongodb+srv://seneca_pratham:GcUrq-cX85pWKSV@cluster0.mm22pii.mongodb.net/hi?retryWrites=true&w=majority";

app.use(express.urlencoded({ extended: true }))

const store = new MongoDBStore({
    uri: uri,
    collection: "sessions_data"
})

app.use(session({
    secret: "A Secret String to Sign the Cookie",
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.get('/login', (req, res) => {
    req.session.isAuth = true
    res.render('login', { msg: '' })
})

app.post('/login', async (req, res) => {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (user) {
        bcrypt.compare(password, user.password, function (error, isMatch) {
            if (error) {
                throw error
            } else if (!isMatch) {
                console.log("Password doesn't match!")
                res.render("login", { msg: 'incorrect' })
            } else {
                res.render("dashboard.ejs")
                console.log("Password matches!")
            }
        })
    }
    else {

        res.render("register", { msg: 'incorrect' })
    }


})


app.get("/register", (req, res) => {

    req.session.isAuth = true
    console.log(req.session)
    console.log(req.session.id)
    //  res.send("Welcome From Home Page!!!")

    res.render('register', { msg: '' })
})

app.post("/register", async (req, res) => {

    let msg = ''
    const { name, email, password } = req.body

    console.log(name)
    console.log(email)
    console.log(password)

    let user = await userModel.findOne({ email })
    // For Existing user We want to directly send user to Login Page With a message
    if (user) {
        msg = 'existing user'
        res.render('login.ejs', { msg: msg })
    }
    // For new user We want to save user to db and show a different message in Login Page 
    else {
        msg = 'new user'
        const hashedPwd = await bcrypt.hash(password, 12)
        console.log(hashedPwd)

        user = new userModel({
            name,
            email,
            password: hashedPwd
        })
        await user.save()

        res.render('login.ejs', { msg: msg })

    }
})


// Dashboard Page
app.get("/dashboard", (req, res) => {
    if (!req.isAuth) {
        throw new Error("not authenticated");
    }
    else {
        const username = req.session.username;
        console.log(username)
        res.render("dashboard.ejs", { name: username });
    }
});



app.post("/logout", (req, res) => {


    req.session.destroy((err) => {
        if (err) throw err;
        msg = 'existing user'
        res.redirect('/register')
    });
})
app.listen(4300, () => {

    console.log("<-----------App is Listening at Port 4300!!!!!!!!!!!!!!!!!!!--->")
})