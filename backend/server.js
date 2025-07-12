const express = require('express');
const multer = require('multer');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Setup Multer for file upload
const upload = multer({ dest: 'uploads/' });

// Patch canvas into face-api
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load face-api models
const MODEL_URL = path.join(__dirname, 'models');

const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_URL);
};

loadModels();

app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const img = await canvas.loadImage(req.file.path);
    const detections = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detections) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'No face detected.' });
    }

    const expressions = detections.expressions;
    const mood = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];

    fs.unlinkSync(req.file.path); // Delete temp file
    res.json({ mood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});
