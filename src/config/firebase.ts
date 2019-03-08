import admin = require('firebase-admin');

const serviceAccount = require('../../transport-server.json');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://transport-server-b95ed.firebaseio.com"
    });
} catch (e) {
}