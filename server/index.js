const port = process.env.PORT || 3000;
const app = require('./app');
const { conn, Product, User, Note } = require('./db');

app.listen(port, async()=> {
  try {
    console.log(`listening on port ${port}`)
    //seed data
    await conn.sync({ force: true });
    const [moe, lucy] = await Promise.all([
        User.create({ username: 'moe', password: 'm' }), 
        User.create({ username: 'lucy', password: 'l' }),
      ]
      );
      
    await Promise.all([
      Product.create({ name: 'foo' }),
      Product.create({ name: 'foop', inStock: false }),
      Product.create({ name: 'bar', inStock: false }),
      Product.create({ name: 'bazz'}),
      Product.create({ name: 'quq'}),
      Product.create({ name: 'quq!!', inStock: false}),
       
      Note.create({ content: 'this is a note', userId: moe.id}), //
      Note.create({ content: 'this is a note2', userId: moe.id}), //
      Note.create({ content: 'this is a note3', userId: lucy.id}), //
    ]);
    console.log('seeded');
  }
  catch(ex){
    console.log(ex);
  }
});
