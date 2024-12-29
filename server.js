const express = require('express')
const app = express()
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const todoRoutes = require('./routes/todos')
const path = require('path')

require('dotenv').config({path: './config/.env'})

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoutes)
app.use('/todos', todoRoutes)

app.use('/todos/monday', todoRoutes)
app.use('/todos/tuesday', todoRoutes)
app.use('/todos/wednesday', todoRoutes)
app.use('/todos/thursday', todoRoutes)
app.use('/todos/friday', todoRoutes)
app.use('/todos/saturday', todoRoutes)
app.use('/todos/sunday', todoRoutes)


app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})