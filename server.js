const express =require('express')
const mongoose =require('mongoose')
const Article = require('./models/article')
const articleRouter=require('./routes/articles')
const methodOverride = require('method-override')
const bodyParser = require("body-parser")

const app=express()

const monoDB ="mongodb://127.0.0.1:27017/manoj";


    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(monoDB) 
        console.log('Mongo connected')
    }
    catch(error) {
        console.log(error)
        
    }
    
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine','ejs') 
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index',{articles: articles })
})

app.use('/articles',articleRouter)


app.listen(5000)