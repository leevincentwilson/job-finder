// File: rebuild-service.js
const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const secret = process.env.WEBHOOK_SECRET || 'your_secret_here';

function validateSignature(req) {
  const signature = req.headers['x-webhook-signature'];
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

app.post('/rebuild', (req, res) => {
  if (!validateSignature(req)) {
    return res.status(401).send('Unauthorized');
  }

  console.log('Rebuilding Astro site...');

  // Execute build command directly inside the existing container
  exec('docker-compose exec -T astro-builder npm run build', (error) => {
    if (error) {
      console.error('Error rebuilding:', error);
      return res.status(500).send('Rebuild failed');
    }
    res.send('Rebuild completed successfully');
  });
});

app.listen(3000, () => {
  console.log('Rebuild service listening on port 3000');
});