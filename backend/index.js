

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

// Endpoint para autenticación anónima
app.post('/auth/anonymous', async (req, res) => {
  try {
    const { uuid } = req.body;
    const token = await admin.auth().createCustomToken(uuid);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generando token');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
