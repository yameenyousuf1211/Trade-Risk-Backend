const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

interface NotificationParams {
    title: string;
    body: string;
    token: string;
}

exports.sendFirebaseNotification = async ({ title, body, token }:NotificationParams) => {
    const message = {
        notification: { title, body },
        token,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("Successfully sent message:", response);
        return response;
    } catch (error) {
        console.error("Error sending message:", error);
        return error;
    }
};