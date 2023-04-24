const Sequelize = require('sequelize');
const { STRING, BOOLEAN, INTEGER, TEXT, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_products_search_db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Product = conn.define('product', {
  name: {
    type: STRING
  },
  inStock: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

const User = conn.define('user', {
  username: {
    type: STRING,
    unique: true
  },
  password: {
    type: STRING
  },
  luckyNumber: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 7
  },
});
//
const Note = conn.define('note', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  content: {
    type: TEXT
  },
});

// User is parent, Note is child
Note.belongsTo(User);
User.hasMany(Note);

User.addHook('beforeSave', async(user)=> {
  user.password = await bcrypt.hash(user.password, 5);
});

User.prototype.generateToken = function(){
  return {
    token: jwt.sign({ id: this.id }, process.env.JWT) 
  };
}

User.register = async function(credentials){
  const user = await this.create(credentials);
  return user.generateToken();
}

User.findByToken = async function(token){
  const { id } = jwt.verify(token, process.env.JWT);
  const user = await this.findByPk(id);
  if(!user){
    const error = Error('bad token!');
    error.status = 401;
    throw error;
  }
  return user;
}

User.authenticate = async function(credentials){
  const { username, password } = credentials;
  const user = await this.findOne({
    where: {
      username
    }
  });
  if(!user || !(await bcrypt.compare(password, user.password))){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  return user.generateToken();
}

module.exports = {
  Product,
  User,
  Note, //
  conn
};
