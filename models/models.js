var path =require('path');
//argar modelo ORM
var Sequelize = require('sequelize');
//usar BBDD SQlite
var sequelize = new Sequelize(null, null, null,{
	dialect: "sqlite", storage: "quiz.sqlite"
});

// Importar la definiion de la tabla Quiz en quiz.js

var Quiz= sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz= Quiz; // exportar definiocion de tabla Quiz
// sequelize.sync() crea e iniializa tabla de pregutnas en DB
sequelize.sync().success(function() {
	// success(..) ejecuta el manejador una vez creada la tabla.
	Quiz.count().success(function (count){
		if (count=== 0){
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			})
			.success(function(){ console.log('base de datos inicializada')});
		};
	});

		
});