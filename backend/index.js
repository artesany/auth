// index.js
import express from 'express';
import cors from 'cors';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Inicializar Firebase Admin
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint de prueba: autenticar usuario anónimo
app.post('/anon-auth', async (req, res) => {
  try {
    // Crear usuario anónimo
    const userRecord = await auth.createUser({});
    
    // Generar token custom
    const token = await auth.createCustomToken(userRecord.uid);

    res.json({
      uid: userRecord.uid,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo crear usuario anónimo', details: error.message });
  }
});

// Endpoint de prueba para Firestore
app.post('/save-uuid', async (req, res) => {
  try {
    const { token, data } = req.body;
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    // Verificar token
    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    // Guardar datos en Firestore
    await db.collection('registros').doc(uid).set({
      ...data,
      createdAt: new Date()
    });

    res.json({ success: true, uid });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Token inválido o error al guardar', details: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
