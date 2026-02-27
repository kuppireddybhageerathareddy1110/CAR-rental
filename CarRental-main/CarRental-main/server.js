const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
const dbConnection = require('./db')

app.use(cors({
    origin: 'https://car-rental-pi-ebon.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json())

app.use('/api/cars/' , require('./routes/carsRoute'))
app.use('/api/users/' , require('./routes/usersRoute'))
app.use('/api/bookings/' , require('./routes/bookingsRoute'))


const path = require('path')

if(process.env.NODE_ENV==='production')
{

    app.use('/' , express.static('client/public'))

    app.get('*' , (req , res)=>{

          res.sendFile(path.resolve(__dirname, 'client/public/index.html'));

    })

}

app.get('/', (req, res) => res.send('Hello World!'))


 


app.listen(port, () => console.log(`Node JS Server Started in Port ${port}`))