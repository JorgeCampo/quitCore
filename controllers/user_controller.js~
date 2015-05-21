var users = { admin: {id:1, username:"admin", password:"1234"}, 
              Jorge:  {id:2, username:"Jorge",  password:"2222"},
	      Gonzalo:  {id:3, username:"Gonzalo",  password:"3333"}
            };

// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error).
exports.autenticar = function(login, password, callback) {
    if(users[login]){
        if(password === users[login].password){
            callback(null, users[login]);
        }
        else { callback(new Error('Contraseña Incorrecta.')); }
    } else { callback(new Error('El usuario no está registrado.'));}
};
