"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

var topic = "nuevo_sismo";

var payload = {
  "notification": {
    "title": "Nuevo sismo detectado",
    "body": "",
    "sound" : "default"
  }
};

exports.sendNewSismoNotification = functions.database.ref("/Sismos/{id}").onCreate(event => {
  console.log(event.data.val());
  let sismo = event.data.val();
  payload.notification.body = sismo["lugar"]

  // Enviamos mensaje de nuevo sismo a los usuarios suscriptos al topico correspondiente
  admin.messaging().sendToTopic(topic, payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
  return event.data.val();
});