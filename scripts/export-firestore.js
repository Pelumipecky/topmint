const admin = require('firebase-admin');
const fs = require('fs');

// Path to your Firebase service account key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const data = {};
  snapshot.forEach(doc => {
    data[doc.id] = doc.data();
  });
  fs.writeFileSync('firebase-export.json', JSON.stringify({ [collectionName]: data }, null, 2));
  console.log('Export complete!');
}

// Change 'userlogs' to your Firestore collection name
exportCollection('userlogs');
