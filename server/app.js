const express = require('express')
const path = require('path')
const { Product, User, Note } = require('./db');
const jwt = require('jsonwebtoken');

const app = express()
app.use(express.json());

// static middleware
app.use('/dist', express.static(path.join(__dirname, '../dist')))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
}); 

app.get('/api/products', async(req, res, next)=> {
  try{
    res.send(await Product.findAll());
  }
  catch(ex){
    next(ex);
  }
});

//
app.get('/api/notes', async(req, res, next)=>{
  try{
    res.send(await Note.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/notes/:id', async(req, res, next) => {
  try{
    const note = await Note.findByPk(req.params.id);
    await note.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/notes', async(req, res, next) => {
  try{
    res.status(201).send(await Note.create(req.body));  
  }
  catch(ex){
    next(ex);
  }
});

app.use('/api/auth', require('./routes/auth'));

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err });

});


module.exports = app;

