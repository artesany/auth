import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import { firebaseServiceAccount } from './config/firebaseServiceAccount.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
});

app.post('/auth-anon', async (req, res) => {
  try {
    // Generar UID aleatorio (o puedes usar el uuid que mandas desde Angular)
    const uid = req.body.uuid || `anon-${Date.now()}`;

    // Crear custom token
    const token = await admin.auth().createCustomToken(uid);

    res.json({ token });
  } catch (err) {
    console.error('Error generando token:', err);
    res.status(500).send(err);
  }
});

app.listen(3000, () => console.log('Servidor backend escuchando en http://localhost:3000'));
