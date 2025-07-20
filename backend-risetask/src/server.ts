// src/server.ts
import https from 'https';
import fs from 'fs';
import app from './App';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

const httpsOptions = {
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem'),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS server running on https://localhost:${PORT}`);
});
