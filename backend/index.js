import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import { firebaseServiceAccount } from './config/firebaseServiceAccount.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(bodyParser.json());

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
});

app.post('/auth-anon', async (req, res) => {
  try {
    if (!req.body.uuid) {
      return res.status(400).json({ error: 'UUID requerido' });
    }
    
    const uid = req.body.uuid;
    const token = await admin.auth().createCustomToken(uid);
    
    // Opcional: guardar usuario en Firestore
    await admin.firestore().collection('users').doc(uid).set({
      createdAt: new Date(),
      type: 'anonymous'
    });
    
    res.json({ token });
  } catch (err) {
    console.error('Error generando token:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Servidor backend escuchando en http://localhost:3000'));