const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


const express = require('express');
const app = express();

// Get a database reference to our blog
var db = admin.database();
var ref = db.ref("/");


//////////////////////////////////ASIGNATURAS/////////////////////////////////////
//Función para añadir una asignatura
//EJ:?text=ODSI,Organización y Dirección de Sistemas de Información,Descripcion
exports.addAsignatura = functions.https.onRequest((req, res) => {
  const valor = req.query.text;
  var valorSplited = valor.split(",");

  var asignaturaRef = ref.child("Asignaturas");

  asignaturaRef.child(valorSplited[0]).set({
    Nombre_asignatura: valorSplited[1],
    Descripcion: valorSplited[2]
  });

});

exports.updateAsignatura = functions.https.onRequest((req, res) => {
  const valor = req.query.text;
  var valorSplited = valor.split(",");

  var asignaturaRef = ref.child("Asignaturas");

  asignaturaRef.child(valorSplited[0]).update({
    Nombre_asignatura: valorSplited[1],
    Descripcion: valorSplited[2]
  });

});

exports.deleteAsignatura = functions.https.onRequest((req, res) => {

  const valor = req.query.text;
  var valorSplited = valor.split(",");

  var asignaturaRef = ref.child("Asignaturas");

  asignaturaRef.child(valorSplited[0]).remove();
});

////////////////////////////////////TAREAS/////////////////////////////////////

exports.addTarea = functions.https.onRequest((req, res) => {
  const valor = req.query.text;
  var valorSplited = valor.split(",");

  var tareaRef = ref.child("Tareas");

  tareaRef.child(valorSplited[0]).set({
    Nombre_de_la_tarea: valorSplited[1],
    Tiempo_estimado: valorSplited[2],
    Fecha_de_creacion: valorSplited[3]
  });

});

exports.updateTarea = functions.https.onRequest((req, res) => {
  const valor = req.query.text;
  var valorSplited = valor.split(",");

  var tareaRef = ref.child("Tareas");

  tareaRef.child(valorSplited[0]).update({
    Nombre_de_la_tarea: valorSplited[1],
    Tiempo_estimado: valorSplited[2],
    Fecha_de_creacion: valorSplited[3]
  });

});

exports.deleteTarea = functions.https.onRequest((req, res) => {
  const valor = req.query.text;
  var valorSplited = valor.split(",");

  var tareaRef = ref.child("Tareas");

  tareaRef.child(valorSplited[0]).remove()

});


////////////////////////////////////USUARIO-ASIGNATURA/////////////////////////////////////



const authenticate = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  if (idToken === 'ODSI18') {
  	return next();
  }else{
  	res.status(403).send('Unauthorized');
    return;
  }
};

app.use(authenticate);


app.get('/usuario-asignatura', (req, res) => {
	// TOFIX

	const idUsuario = req.query.idUsuario;
	const idAsignatura = req.query.idAsignatura;
	if(idUsuario && idAsignatura){
	    var key = "U:"+idUsuario+"-A:"+idAsignatura;
	    return ref.child("Usuarios_Asignaturas").child(key).once('value').then((snapshot) => {
		    let messages = [];
		    snapshot.forEach((childSnapshot) => {
		    	console.log(childSnapshot);
		     	messages.push(childSnapshot);
		    });

    	 	return res.status(200).json(messages);
    	 });


	  }else if(idAsignatura){
	  
	  }else if(idUsuario){
	   
	  }
  	res.status(200).send("OK");
});

app.post('/usuario-asignatura', (req, res) => {
	const json = req.body;
	var key = "U:"+json.idUsuario+"-A:"+json.idAsignatura;
		console.log(key);
  	ref.child("Usuarios_Asignaturas").child(key).set({
   	 	IdUsuario: json.idUsuario,
    	IdAsignatura: json.idAsignatura
	});
  	res.status(200).send("OK");
});

app.delete('/usuario-asignatura', (req, res) => {
	const json = req.body;
	deleteUsuarioAsignatura(json)
  	res.status(200).send("OK");
});



app.post('/usuario-asignatura-multiple', (req, res) => {
  	const jsonArray = req.body;
  	jsonArray.forEach(function(json) {
  		var key = "U:"+json.idUsuario+"-A:"+json.idAsignatura;
	  	ref.child("Usuarios_Asignaturas").child(key).set({
	   	 	IdUsuario: json.idUsuario,
	    	IdAsignatura: json.idAsignatura
		});
	});
  	res.status(200).send("OK");
});

app.delete('/usuario-asignatura-multiple', (req, res) => {
  	const jsonArray = req.body;
  	jsonArray.forEach(function(json) {
  		var key = "U:"+json.idUsuario+"-A:"+json.idAsignatura;
		ref.child("Usuarios_Asignaturas").child(key).remove();
	});
  res.status(200).send("OK");
});

exports.asignaturas = functions.https.onRequest(app);


function deleteUsuarioAsignatura(json){
  if(json.idUsuario && json.idAsignatura){
    var key = "U:"+json.idUsuario+"-A:"+json.idAsignatura;
    ref.child("Usuarios_Asignaturas").child(key).remove();
  }else if(json.idAsignatura){
    var rels = ref.child("Usuarios_Asignaturas").orderByChild("IdAsignatura").equalTo(json.idAsignatura);
    rels.on('value', function(snapshot) {
        snapshot.forEach(function(data) {
          console.log(data.key);
            ref.child("Usuarios_Asignaturas").child(data.key).remove();
        });
    });
  }else if(json.idUsuario){
    var rels = ref.child("Usuarios_Asignaturas").orderByChild("IdUsuario").equalTo(json.idUsuario);
    rels.on('value', function(snapshot) {
        snapshot.forEach(function(data) {
          console.log(data.key);
            ref.child("Usuarios_Asignaturas").child(data.key).remove();
        });
    });
  }
}
