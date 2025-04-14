const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 5000;
const upload = multer({ dest: "uploads/" });

// Enable CORS for all routes
app.use(cors());
app.use(express.json());


const TESSERACT_CONFIG = ['--oem 1', '--psm 6', '-l bul+eng', '--dpi 300', '-c preserve_interword_spaces=1'].join(' ');

// 📌 Secure OCR + AI Processing
app.post("/api/ocr", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log(`📸 Processing image: ${req.file.path}`);

        // Extract text using Tesseract
        exec(`tesseract ${req.file.path} stdout ${TESSERACT_CONFIG}`, async (error, stdout) => {
            if (error) {
                return res.status(500).json({ error: "OCR failed", details: error.message });
            }

            const extractedText = stdout.trim();
            console.log("📝 Extracted Text:", extractedText);

            // Analyze text using Ollama (Mistral 7B)
            const analyzedData = await analyzeWithMistral(extractedText);

            res.json({ extractedText, analyzedData });
            fs.unlinkSync(req.file.path);
        });

    } catch (error) {
        res.status(500).json({ error: "Error processing image", details: error.message });
    }
});

function splitOcrByScript(text) {
    const latinLines = [];
    const cyrillicLines = [];

    for (const line of text.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const isCyrillic = /[А-Яа-яЁё]/.test(trimmed);
        (isCyrillic ? cyrillicLines : latinLines).push(trimmed);
    }

    return {
        latinBlock: latinLines.join('\n'),
        cyrillicBlock: cyrillicLines.join('\n')
    };
}

function inferGender(text) {
    if (/Пол\/Sec\s*(Ж|F)/.test(text)) return "F";
    if (/Пол\/Sec\s*(М|M)/.test(text)) return "M";
    return "";
}

async function analyzeWithMistral(text) {
    const { latinBlock, cyrillicBlock } = splitOcrByScript(text);
    const genderHint = inferGender(text);

    const prompt = `
TASK: Extract structured information from a Bulgarian ID document OCR text.

Rules:
1. Use only Latin script unless specified otherwise.
2. Extract:
- fullName: Full name in Latin.
- surname: Surname (UPPERCASE).
- givenName: First name (Latin).
- middleName: Middle name (Latin).
- nationality: In Cyrillic.
- dateOfBirth: DD.MM.YYYY.
- gender: M or F.
- personalNo: 10-digit Bulgarian Personal Number.
- documentNo: Format AA0000000.
- expiryDate: DD.MM.YYYY.

Never guess or hallucinate.
Ensure name parts are parsed in correct order (e.g., Slavina Georgieva IVANOVA → Slavina, Georgieva, IVANOVA).
If data is missing, leave it as an empty string.
Use OCR LATIN TEXT for name, document number, gender, personal number and dates.
Use OCR CYRILLIC TEXT only to extract nationality (e.g., "БЪЛГАРИЯ").

Gender Rules:
- If OCR contains "Пол/Sec Ж/F", gender is "F".
- If OCR contains "Пол/Sec М/M", gender is "M".
- If not present, return "".

Return the result as valid JSON with exactly these fields:
{
    "fullName": "In Latin, format: Given Middle SURNAME",
    "surname": "Only surname, UPPERCASE",
    "givenName": "Only first name (Latin)",
    "middleName": "Only middle name (Latin)",
    "nationality": "From Cyrillic block, should be 'БЪЛГАРИЯ'",
    "dateOfBirth": "DD.MM.YYYY",
    "gender": "Single character, 'F' or 'M'",
    "personalNo": "10-digit personal number",
    "documentNo": "ID format: AA0000000",
    "expiryDate": "DD.MM.YYYY"
}

OCR LATIN TEXT:
${latinBlock}

OCR CYRILLIC TEXT:
${cyrillicBlock}

HINT: gender = "${genderHint}"
`;

    try {
        const llmResponse = await axios.post("http://host.docker.internal:11434/api/generate", {
            model: "mistral",
            prompt,
            stream: false
        });

        // Clean and parse JSON
        const raw = llmResponse.data.response;

        const cleanJson = raw.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("Mistral Analysis Error:", error.message);
        return {
            fullName: "",
            surname: "",
            givenName: "",
            middleName: "",
            nationality: "",
            dateOfBirth: "",
            gender: "",
            personalNo: "",
            documentNo: "",
            expiryDate: ""
        };
    }
}


app.listen(port, () => console.log(`🚀 Private AI backend running on port ${port}`));
