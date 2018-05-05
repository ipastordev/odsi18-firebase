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
    var msg = "[";

    var msg_idSubject = checkIsValidString(json.idAsignatura, "Introduzca el identificador de la asignatura");
    if(msg_idSubject !== ""){
      msg = msg + "'" + msg_idSubject +  "'";
    }
  
    var msg_nameSubject = checkIsValidString(json.idNombre, "Introduzca el nombre de la asignatura");
    if(msg_nameSubject !== ""){
        if(msg !== "["){
          msg = msg + ", ";
        }
        msg = msg +  "'" + msg_nameSubject +  "'";
    }
  
    var msg_descriptionSubject = checkIsValidString(json.idDescripcion, "Introduzca la descripción de la asignatura");
    if(msg_descriptionSubject !== ""){
      if(msg !== "["){
          msg = msg + ", ";
        }
      msg = msg +  "'" + msg_descriptionSubject +  "'";
    }
  
    msg = msg + "]";

    if(msg === "[]") {
        //Almacenar asignatura en la BD y mostrar mensaje informandole al usuario
        console.log('Guardada asignatura: ' + json.idAsignatura + " " + json.idNombre + " " + json.idDescripcion);
        msg = "['La asignatura se creó correctamente']";
        var key = json.idAsignatura;
        ref.child("Asignaturas").child(key).set({
            Descripcion: json.idDescripcion,
            Nombre_asignatura: json.idNombre
        });
    }else{
        console.log('No se pudo guardar asignatura: ' + json.idAsignatura + " " + json.idNombre + " " + json.idDescripcion);
    }
  	res.status(200).json(msg);
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
    
    var msg = "[";

    var msg_idHomework = checkIsValidString(json.idTarea, "Introduzca el identificador de la tarea");
    if(msg_idHomework !== ""){
        msg = msg + "'" + msg_idHomework +  "'";
    }

    var msg_nameHomework = checkIsValidString(json.idNombre, "Introduzca el nombre de la tarea");
    if(msg_nameHomework !== ""){
        if(msg !== "["){
            msg = msg + ", ";
        }
        msg = msg +  "'" + msg_nameHomework +  "'";
    }

    var msg_estimatedTime = checkIsValidEstimatedTime(json.idTiempo);
    if(msg_estimatedTime !== ""){
        if(msg !== "["){
            msg = msg + ", ";
        }
        msg = msg +  "'" + msg_estimatedTime +  "'";
    }


    var msg_creationDate = checkIsValidCreationDate(json.idFecha);
    if(msg_creationDate !== ""){
        if(msg !== "["){
            msg = msg + ", ";
        }
        msg = msg + "'" + msg_creationDate +  "'";
    }
    msg = msg + "]";

    if(msg === "[]") {
        //Almacenar tarea en la BD y mostrar mensaje informandole al usuario
        console.log('Guardada tarea: '  + json.idTarea + " " + json.idNombre + " "  + json.idTiempo + " " + json.idFecha);
        msg = "['La tarea se creó correctamente']";
        var key = json.idTarea;
        ref.child("Tareas").child(key).set({
              Fecha_de_creacion: json.idFecha,
          Nombre_de_la_tarea: json.idNombre,
          Tiempo_estimado: json.idTiempo
      });
    }else {
        console.log('No se pudo guardar tarea: ' + json.idTarea + " " + json.idNombre + " "  + json.idTiempo + " " + json.idFecha);
    }
    res.status(200).json(msg);

  	
});

  //Expect input as HH:MM, HHH:MM: 01:40, 00:20, 85:40, 120:20, max 999:59
  function checkIsValidEstimatedTime(e) {
    var m;
    if(e !== "" && e !== null &&  e !== undefined)
    {
        var trimmedEstimatedTime = e.trim();
        if(/^(0[0-9]{1}|[1-9]{1}[0-9]{1,2}):([0-5][0-9])$/.test(trimmedEstimatedTime)){
            m = "";
        }else{
            m = "El tiempo estimado no tiene el formato correcto";
        }
    }else{
        m = "Introduzca un tiempo estimado para la tarea";
    }
        return m;
  }

  //Fecha a partir de la fecha actual?
 // Expect input as d/m/y: 2/2/1990, 02/02/1990
function checkIsValidCreationDate(d) {
    var m;
    if(d !== "" && d !== null &&  d !== undefined)
    {
        var trimmedCreationDate = d.trim();
        var bits = trimmedCreationDate.split('/');
        var date = new Date(bits[2], bits[1] - 1, bits[0]);
        if(date && Number(date.getMonth() + 1) === Number(bits[1])){
            m = "";
        }else{
            m = "La fecha de creación no tiene el formato correcto";
        }
    }else{
        m = "Introduzca una fecha de creación para la tarea";
    }
        return m;
  }

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

////////////////////////////////////////////USUARIO-TAREA///////////////////////////////////////////////////

app.get('/getUsuarioTarea', (req, res) => {
        const idUsuario = req.query.idUsuario;
        const idTarea = req.query.idTarea;
	if(idUsuario && idTarea){
		var key = "U:"+idUsuario+"-T:"+idTarea;

		return ref.child("Usuarios_Tareas").child(key).once('value').then((snapshot) => {
                    let messages = [];
                    messages.push(snapshot);
                    return res.status(200).json(messages);
         	});
	}
        res.status(200).send("OK");
});


app.post('/addUsuarioTarea', (req, res) => {
        const json = req.body;
	var key = "U:"+json.idUsuario+"-T:"+json.idTarea;

        ref.child("Usuarios_Tareas").child(key).set({
                IdUsuario: json.idUsuario,
        	IdTarea: json.idTarea,
                Tiempo_realizado: json.idTiempo
        });
        res.status(200).send("OK");
});

app.post('/updateUsuarioTarea', (req,res) => {
        const json = req.body;
	var key = "U:"+json.idUsuario+"-T:"+json.idTarea;

    rels = ref.child("Usuarios_Tareas/"+key).once("value", function(snapshot){
                var exists = (snapshot.val() !== null);
                if(exists)
                {
                        ref.child("Usuarios_Tareas").child(key).update({
                                        IdUsuario: json.IdUsuario,
                                        IdTarea: json.IdTarea,
                                        Tiempo_realizado: json.idTiempo
                                });
                }
        });

        res.status(200).send("OK");
});

app.delete('/deleteUsuarioTarea', (req, res) => {
        const json = req.body;
	var key = "U:"+json.idUsuario+"-T:"+json.idTarea;
        ref.child("Usuarios_Tareas").child(key).remove();
    res.status(200).send("OK");
});

exports.usuariosTareas = functions.https.onRequest(app);



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
		    let subjectsToFetch = [];
		    snapshot.forEach(function(childSnapshot) {
			     subjectsToFetch.push(childSnapshot.child("IdAsignatura").val());
  			});

        const subjectPromises = subjectsToFetch.map(id => ref.child("Asignaturas").child(id).once('value'));
        
        return Promise.all(subjectPromises)
          .then((subjects) => {
             subjects.forEach(function(subject) {
               console.log(subject.key);
            });
            return res.status(200).json(subjects);
          })
          

	    	
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

    rels = ref.child("Usuarios_Asignaturas/"+key).once("value", function(snapshot){
		var exists = (snapshot.val() !== null);
		if(exists)
		{
			ref.child("Usuarios_Asignaturas").child(key).update({
					IdAsignatura: json.IdAsignatura,
					IdUsuario: json.IdUsuario
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

////////////////////////////////////USUARIOS/////////////////////////////////////

//key: UTF-8 encoded, cannot contain . $ # [ ] /
app.post('/registrarUsuario', (req, res) => {
    const json = req.body;
    
    var msg = "[";
  
    var msg_name = checkIsValidString(json.uNombre, "Introduzca el nombre del usuario");
    if(msg_name !== ""){
      msg = msg + "'" + msg_name +  "'";
    }
  
    var msg_surname = checkIsValidString(json.uApellido, "Introduzca el apellido del usuario");
    if(msg_surname !== ""){
        if(msg !== "["){
          msg = msg + ", ";
        }
        msg = msg +  "'" + msg_surname +  "'";
    }
  
    var msg_email = checkIsValidEmail(json.uEmail);
    if(msg_email !== ""){
      if(msg !== "["){
          msg = msg + ", ";
        }
      msg = msg +  "'" + msg_email +  "'";
    }
  
  
    var msg_isTeacher = checkIsValidIsTeacher(json.uProfesor);
    if(msg_isTeacher !== ""){
      if(msg !== "["){
          msg = msg + ", ";
        }
      msg = msg + "'" + msg_isTeacher +  "'";
    }
    msg = msg + "]";
  
    if(msg === "[]") {
        //Almacenar usuario en la BD y mostrar mensaje informandole al usuario
        console.log('Guardado usuario: ' + json.uNombre + " " + json.uApellido + " " + json.uEmail + " " + json.uProfesor);
        msg = "['El usuario se creó correctamente']";
        var key = "U:"+encodeKey(json.uEmail);
        ref.child("Usuarios").child(key).set({
            Nombre: json.uNombre,
            Apellido: json.uApellido,
            Profesor: json.uProfesor
      });
    }else {
        console.log('No se pudo guardar usuario: ' + json.uNombre + " " + json.uApellido + " " + json.uEmail + " " + json.uProfesor);
    }
        res.status(200).json(msg);
  });
  
  function encodeKey(s) {
       return encodeURIComponent(s).replace(/\./g,'%2E'); 
      }
  
  function decodeKey(s) {
      return decodeURIComponent(s).replace(/%2E/g, '.'); 
      }
  
  
  //Validacion general, para aquellos string que no tienen regex definida
  //Los nombres ni apellidos no se validan con regex
  function checkIsValidString(s, msgError){
    var m;
    if(s !== "" && s !== null &&  s !== undefined){
      var trimmedString = s.trim();//El string no son todo espacios en blanco
      if(trimmedString !== ""){
        m = "";
      }else{
          m = msgError;
      }
    }else{
        m = msgError;
    }
    return m;
   }
  
  
   function checkIsValidEmail(e){
    var m;
    if(e !== "" && e !== null &&  e !== undefined)
    {
        var trimmedEmail = e.trim();
        if(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(trimmedEmail)){
            m = "";
        }else{
            m = "El email no tiene el formato correcto";
        }
    }else{
        m="Introduzca el email del usuario"
    }
        return m;
   }
  
  
   //Pongo esta funcion o si recibo el param uProfesor y no tiene el valor value
   // supongo que es teacher el usuario ?
  
   //uProfesor sera un checkbox que se selecciona o no
   // <input type="checkbox" name="uProfesor" value="true" checked="checked"> Es profesor <br>
   //action_page.php?uProfesor=true (si se selecciona)
   //action_page.php (si no se selecciona)
   function checkIsValidIsTeacher(i){
    var m;
    if(i !== "" && i !== null && i !== undefined)
    {
       if(i !== true && i !== false){ 
            m = "El valor para el parámetro uProfesor no es válido";
       }else{
           m = "";
       }
    }else{
        m = "No se ha indicado si el usuario es profesor o no";
    }
        return m;
   }
  
  
   app.delete('/usuario', (req, res) => {
      const json = req.body;
      deleteUsuario(json)
      console.log("Eliminado el usuario " + json.uEmail);
      res.status(200).send("El usuario se eliminó correctamente");
  });
  
  function deleteUsuario(json){
    if(json.uNombre && json.uApellido && json.uEmail && json.uProfesor){
      var key = "U:"+encodeKey(json.uEmail);
      ref.child("Usuarios").child(key).remove();
    }
  }
  
  app.get('/usuario', (req, res) => {
      const uNombre = req.query.uNombre;
      const uApellido = req.query.uApellido;
      const uEmail = encodeKey(req.query.uEmail);
      const uProfesor = req.query.uProfesor;    
  
      var key = "U:"+uEmail;
      return ref.child("Usuarios").child(key).once('value').then((snapshot) => {
          return res.status(200).json(snapshot);
          });
  });


exports.usuarios = functions.https.onRequest(app);

/**************************************************
              HOSTING - PAGINA WEB
****************************************************/
const web = express();

web.set('views', './views');
web.set('view engine', 'ejs');


admin.initializeApp(functions.config().firebase, "web");

var tokenUser = "";
var emailUser = "";

var rest = require("request");
var options = {
  headers: {
    'Authorization': 'Bearer ODSI18'
  }
};



/**
*   Routing
**/

// Renderizar la página.
web.get("/", (request, response) => {
  response.render('index', {});
});

// Recibir el token del usuario y comprobar que esta
web.post("/", (request, response) => {
  var idToken = request.body.user;
  emailUser = request.body.email;

  admin.auth().verifyIdToken(idToken).then(function(decodedToken){
    var uid = decodedToken.uid;
    if(uid != null){
      tokenUser = idToken;
      response.status(200).end();
    }
    else
      response.status(404).end();
  })
})



web.get("/inicio", (request, response) => {
  admin.auth().verifyIdToken(tokenUser).then(function(decodedToken){
    var uid = decodedToken.uid;
    if(uid != null){
        
      // BackEnd request to check if user is a teacher
      rest('http://localhost:5001/odsi-gestiontiempos/us-central1/asignaturas/usuario?uEmail='+emailUser, options, function(error, res, body){
        var json = res.body;
        json = JSON.parse(json); // Converts array data to JSON and sets data types

        if(json.Profesor){
          // User is a teacher
          response.render('templateTeacher', {
            abbr: ["ODSI", "GID", "SGI", "ITI", "CCR", "DSAR", "RA", "GAII", "SUE", "IUAU", "MN"], 
            nombre: ["Organización y Dirección de Sistemas de Información", "Gestión Intensiva de Datos: Big Data", "Sistemas Gráficos Interactivos", "Integración de las Tecnologías de la Información y Técnicas Avanzadas de Ingeniería del Software", "Codificación y Criptografia", "Diseño de Sistemas de Alto Rendimiento", "Razonamiento Automático", "Gestión y Administración de Infraestructuras Informáticas", "Sistemas Ubícuos y Empotrados", "Interfaces de Usuario y Acceso Universal", "Métodos Numéricos"],
            abbrForm:"", 
            nombreForm:"", 
            usuarios:[],
            pagina: "Nueva",
            accion:"Guardar"
          });
        }else{
          // User is a student
          response.render('templateUser', {
            abbr: ["ODSI", "GID", "SGI", "ITI", "CCR", "DSAR", "RA", "GAII", "SUE", "IUAU", "MN"], 
            nombre: ["Organización y Dirección de Sistemas de Información", "Gestión Intensiva de Datos: Big Data", "Sistemas Gráficos Interactivos", "Integración de las Tecnologías de la Información y Técnicas Avanzadas de Ingeniería del Software", "Codificación y Criptografia", "Diseño de Sistemas de Alto Rendimiento", "Razonamiento Automático", "Gestión y Administración de Infraestructuras Informáticas", "Sistemas Ubícuos y Empotrados", "Interfaces de Usuario y Acceso Universal", "Métodos Numéricos"],
            pagina:"Nueva",
          });
        }
      })

    }else
      response.status(404).end();
  });
});




web.get("/logout", (request, response) => {
  response.redirect("/");
})


web.get("/tareas", (request, response) => {
  response.render('templateAsignatura', {
    "nombreAsignatura": "Asignatura",
    "descripcion": "Esto es una tarea \n Tiempo estimado: es relativo",
    "tiempoRealizado": "00:00:00"
  });
})


web.get("/registro", (request, response) => {
  response.render('signUp');
});

exports.web = functions.https.onRequest(web);