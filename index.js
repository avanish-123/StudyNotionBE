const express = require('express');
const { dbConnect } = require('./config/database');
const router = require('./routes/userRoutes');
const app = express();
require('dotenv').config();
const Port = process.env.PORT || 5000



dbConnect(process.env.MONGODB_URL)
app.use(express.json());
app.use('/api/v1', router)

app.get('/', (req, res) => {
    res.send('<h1>namaste duniya</h1>');
})

app.listen(Port, ()=>{
    console.log(`app listening on ${Port}`)
})