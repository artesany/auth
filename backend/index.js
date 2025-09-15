import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import { firebaseServiceAccount, ADMIN_SECRET_KEY } from './config/firebaseServiceAccount.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(bodyParser.json());

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
});

// ✅ Middleware para autenticación admin
const authenticateAdminRequest = (req, res, next) => {
  const secretKey = req.headers['x-admin-key'] || req.body.secretKey;
  
  if (!secretKey || secretKey !== ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin key' });
  }
  next();
};

// Endpoint existente (sin cambios)
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

// ✅ NUEVOS ENDPOINTS - AHORA SÍ USAN EL MIDDLEWARE
app.post('/admin/set-claims', authenticateAdminRequest, async (req, res) => {
  try {
    const { uid, claims } = req.body;
    
    if (!uid || !claims) {
      return res.status(400).json({ error: 'UID y claims requeridos' });
    }
    
    // Verificar que el usuario existe
    try {
      await admin.auth().getUser(uid);
    } catch (error) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Setear custom claims
    await admin.auth().setCustomUserClaims(uid, claims);
    
    // Invalidar tokens existentes para que los cambios surtan efecto inmediato
    await admin.auth().revokeRefreshTokens(uid);
    
    res.json({ 
      success: true, 
      message: `Custom claims actualizados para usuario ${uid}`,
      claims: claims
    });
    
  } catch (err) {
    console.error('Error setting custom claims:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ USANDO EL MIDDLEWARE
app.post('/admin/promote-to-admin', authenticateAdminRequest, async (req, res) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'UID requerido' });
    }
    
    // Verificar que el usuario existe
    try {
      await admin.auth().getUser(uid);
    } catch (error) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Setear claim de admin
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    
    // Invalidar tokens existentes
    await admin.auth().revokeRefreshTokens(uid);
    
    res.json({ 
      success: true, 
      message: `Usuario ${uid} promovido a administrador`
    });
    
  } catch (err) {
    console.error('Error promoting to admin:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ USANDO EL MIDDLEWARE
app.get('/admin/user-claims/:uid', authenticateAdminRequest, async (req, res) => {
  try {
    const { uid } = req.params;
    
    const user = await admin.auth().getUser(uid);
    
    res.json({
      uid: user.uid,
      customClaims: user.customClaims || {},
      email: user.email,
      displayName: user.displayName
    });
    
  } catch (err) {
    console.error('Error getting user claims:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Servidor backend escuchando en http://localhost:3000'));