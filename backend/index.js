import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;

import express from 'express';
import app from './app.js';
import connectDb from './config/db.js'


connectDb().then(
    app.listen(port,()=>{
        console.log(`everything working fine :) and the server is runing at port at ${port}`)
    })
).catch((error)=>
    console.error(`not working :( ${error}`)
)