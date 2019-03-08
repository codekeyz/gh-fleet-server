import admin = require('firebase-admin');

const serviceAccount = require('../../transport-server.json');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://transport-server-b95ed.firebaseio.com",
        storageBucket: "transport-server-b95ed.appspot.com"
    });
} catch (e) {
}