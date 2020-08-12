const mongoose = require ('mongoose')

mongoose.Promise = global.Promise;

//conectar o banco de dados mongo com o nosso app

mongoose.connect ('mongodb://localhost/todo-list', {useNewUrlParser: true, useUnifiedTopology: true})
.then (()=> console.log('conectado ao MongoDB'))
.catch((err) => console.error(err));

