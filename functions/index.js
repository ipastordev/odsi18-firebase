const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


const express = require('express');
const app = express();

// Get a database reference to our blog
var db = admin.database();
var ref = db.ref("/");


//////////////////////////////////ASIGNATURAS/////////////////////////////////////

app.get('/getAsignatura', (req, res) => {
	const idAsignatura = req.query.idAsignatura;
	if(idAsignatura){
	    var key = idAsignatura;
	    return ref.child("Asignaturas").child(key).once('value').then((snapshot) => {
		    let messages = [];
		    messages.push(snapshot);
		    return res.status(200).json(messages);
    	 });
  	}
  	res.status(200).send("OK");
});

app.post('/addAsignatura', (req, res) => {
	const json = req.body;
	var key = json.idAsignatura;
  	ref.child("Asignaturas").child(key).set({
   	 	Descripcion: json.idDescripcion,
    	Nombre_asignatura: json.idNombre
	});
  	res.status(200).send("OK");
});

app.post('/updateAsignatura', (req,res) => {
	const json = req.body;
	var key = json.idAsignatura;
	
    rels = ref.child("Asignaturas/"+key).once("value", function(snapshot){	
		var exists = (snapshot.val() !== null);
		if(exists)
		{
			ref.child("Asignaturas").child(key).update({
					Descripcion: json.idDescripcion,
					Nombre_asignatura: json.idNombre
				});	
		}	
	});

	res.status(200).send("OK");
});

app.delete('/deleteAsignatura', (req, res) => {
  	const json = req.body;
  	var key = json.idAsignatura;
	ref.child("Asignaturas").child(key).remove();
    res.status(200).send("OK");
});


exports.asignaturas = functions.https.onRequest(app);

////////////////////////////////////TAREAS/////////////////////////////////////

app.get('/getTarea', (req, res) => {
	const idTarea = req.query.idTarea;
	if(idTarea){
	    var key = idTarea;
	    return ref.child("Tareas").child(key).once('value').then((snapshot) => {
		    let messages = [];
		    messages.push(snapshot);
		    return res.status(200).json(messages);
    	 });
  	}
  	res.status(200).send("OK");
});

app.post('/addTarea', (req, res) => {
	const json = req.body;
	var key = json.idTarea;
  	ref.child("Tareas").child(key).set({
   	 	Fecha_de_creacion: json.idFecha,
    	Nombre_de_la_tarea: json.idNombre,
		Tiempo_estimado: json.idTiempo
	});
  	res.status(200).send("OK");
});

app.post('/updateTarea', (req,res) => {
	const json = req.body;
	var key = json.idTarea;
	
    rels = ref.child("Tareas/"+key).once("value", function(snapshot){	
		var exists = (snapshot.val() !== null);
		if(exists)
		{
			ref.child("Tareas").child(key).update({
					Fecha_de_creacion: json.idFecha,
					Nombre_de_la_tarea: json.idNombre,
					Tiempo_estimado: json.idTiempo
				});	
		}	
	});

	res.status(200).send("OK");
});

app.delete('/deleteTarea', (req, res) => {
  	const json = req.body;
  	var key = json.idTarea;
	ref.child("Tareas").child(key).remove();
    res.status(200).send("OK");
});


exports.tareas = functions.https.onRequest(app);


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
	const idUsuario = req.query.idUsuario;
	const idAsignatura = req.query.idAsignatura;
	if(idUsuario && idAsignatura){
	    var key = "U:"+idUsuario+"-A:"+idAsignatura;
	    return ref.child("Usuarios_Asignaturas").child(key).once('value').then((snapshot) => {
		    let messages = [];
		    messages.push(snapshot);
		    return res.status(200).json(messages);
    	 });
  	}else if(idAsignatura){
	    return ref.child("Usuarios_Asignaturas").orderByChild("IdAsignatura").equalTo(idAsignatura).once('value').then((snapshot) => {
		    let messages = [];
		    snapshot.forEach(function(childSnapshot) {
			     messages.push(childSnapshot);
			  });
		    return res.status(200).json(messages);
		});
  	}else if(idUsuario){
	   	return ref.child("Usuarios_Asignaturas").orderByChild("IdUsuario").equalTo(idUsuario).once('value').then((snapshot) => {
		    let messages = [];
		    snapshot.forEach(function(childSnapshot) {
			     messages.push(childSnapshot);
  			});
	    	return res.status(200).json(messages);
	 	});
  	}
  	res.status(200).send("OK");
});

app.post('/usuario-asignatura', (req, res) => {
	const json = req.body;
	var key = "U:"+json.idUsuario+"-A:"+json.idAsignatura;
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

app.post('/updateUsuarioAsignatura', (req,res) => {
	const json = req.body;
	var key = "U:"+json.idUsuario+"-A:"+json.idAsignatura;
	
    rels = ref.child("Asignaturas/"+key).once("value", function(snapshot){	
		var exists = (snapshot.val() !== null);
		if(exists)
		{
			ref.child("Asignaturas").child(key).update({
					IdAsignatura: json.idAsignatura,
					IdUsuario: json.idUsuario
				});	
		}	
	});

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

//No se puede usar - para nombrar las funciones
exports.usuariosAsignaturas = functions.https.onRequest(app);


function deleteUsuarioAsignatura(json){
  if(json.idUsuario && json.idAsignatura){
    key = "U:"+json.idUsuario+"-A:"+json.idAsignatura;
    ref.child("Usuarios_Asignaturas").child(key).remove();
  }else if(json.idAsignatura){
    rels = ref.child("Usuarios_Asignaturas").orderByChild("IdAsignatura").equalTo(json.idAsignatura);
    rels.on('value', function(snapshot) {
        snapshot.forEach(function(data) {
          console.log(data.key);
            ref.child("Usuarios_Asignaturas").child(data.key).remove();
        });
    });
  }else if(json.idUsuario){
    rels = ref.child("Usuarios_Asignaturas").orderByChild("IdUsuario").equalTo(json.idUsuario);
    rels.on('value', function(snapshot) {
        snapshot.forEach(function(data) {
          console.log(data.key);
            ref.child("Usuarios_Asignaturas").child(data.key).remove();
        });
    });
  }
}
