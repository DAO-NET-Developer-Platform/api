const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const { connect} = require("@interep/db")

const db_url = process.env.DB_URL

// const db_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/daocoders';
const db_test = process.env.MONGODB_TEST_URL

const database_url = process.env.NODE_ENV === 'test' ? db_test : db_url

connect(database_url)
.then(() => console.log('interep db connected successfully'))
.catch((e) => console.log('Error with interep db connection'))

mongoose.connect(database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).catch(error => {
    console.error(error)
})

mongoose.connection.on('connected', () => {
    console.log('Client connected to mongo database');
})

mongoose.connection.on('error', (err) => {
    console.log(err.message);
})

mongoose.connection.on('disconnected', () => {
    console.log('Client disconnected from mongodb');
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})