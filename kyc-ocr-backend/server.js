const { exec } = require('child_process');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/get-google-token', (req, res) => {
    exec('gcloud auth print-access-token', (error, stdout) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to get access token' });
        }
        res.json({ access_token: stdout.trim() });
    });
});

app.listen(port, () => console.log(`Backend running on port ${port}`));
