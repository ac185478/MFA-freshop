const express = require('express');

const app = express();

app.get('/welcome',(req,res)=>{
    res.sendFile(__dirname+'/welcome.html');
})