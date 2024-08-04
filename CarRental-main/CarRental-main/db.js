const mongoose = require("mongoose");

function connectDB(){

    mongoose.connect('mongodb+srv://projectuser:qwerty1234@cluster0.sogczow.mongodb.net/CarsData' , {useUnifiedTopology: true , useNewUrlParser: true})

    const connection = mongoose.connection

    connection.on('connected' , ()=>{
        console.log('Mongo DB Connection Successfull')
    })

    connection.on('error' , ()=>{
        console.log('Mongo DB Connection Error')
    })


}

connectDB()

module.exports = mongoose