const express = require('express')
const app = express()
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const multer = require('multer')
const mongodbStore = require('connect-mongodb-session')(session)



// routes
const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')


mongoose.connect(process.env.MONGODBURI, { userNewUrlParser: true })
    .then(console.log('MongoDB connected!'))

const store = new mongodbStore({
    uri: process.env.MONGODBURI,
    collection: 'sessions'
})

// middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: process.env.JWT_TOKEN,
    resave: false,
    saveUninitialized: false,
    store: store
}))


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})


app.use(morgan('dev'))
console.log('haylo')
app.use('/post', postRoutes)
app.use(authRoutes)
app.use('/user', userRoutes)


app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Unauthorized' })
    }
})

app.use((error, req, res, next) => {
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({ message: message, data: data })
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
})