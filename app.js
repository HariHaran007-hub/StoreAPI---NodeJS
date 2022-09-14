const express = require('express')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')


require('dotenv').config()
// async errors
require('express-async-errors')

const app = express()
const port =  3000

//middleware
app.use(express.json())


//Routes
app.get('/', (req,  res)=>{
    res.send('<h1>Store API</h1> <a href="/api/v1/products">products </a>')
})

app.use('/api/v1/products', productsRouter)


//This should be added at last
app.use(errorHandlerMiddleware)
app.use(notFound)

const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URI)
                
        app.listen(port, ()=>{
            console.log(`Server listing to the port ${port} and DB connection successful`);
        })
    } catch(error){
        console.log(error)
    }
}

start()

