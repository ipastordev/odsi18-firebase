const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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


