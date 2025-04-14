const axios = require("axios");
const fs = require("fs");
const { exec } = require("child_process");
const util = require('util');
const { inferGender } = require("./utils/validation");

const execPromise = util.promisify(exec);

// Prompt
const prompts = {
    "Precise Extraction": `
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

If data is missing, leave it as an empty string.
Use OCR LATIN TEXT for name, document number, gender, personal number and dates.
Use OCR CYRILLIC TEXT only to extract nationality (e.g., "БЪЛГАРИЯ").

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

- Never guess or hallucinate.
- Use OCR LATIN TEXT for everything except nationality.
- If a field is missing or unreadable, use "".
- Ensure name parts are parsed in correct order (e.g., Slavina Georgieva IVANOVA → Slavina, Georgieva, IVANOVA).

Gender Rules:
- If OCR contains "Пол/Sec Ж/F", gender is "F".
- If OCR contains "Пол/Sec М/M", gender is "M".
- If not present, return "".


DOCUMENT TEXT:
`,
};

// --------------------
// OCR Extract
// --------------------
async function extractTextFromImage(imagePath) {
    console.log("Running OCR...\n");
    const { stdout } = await execPromise(
        `tesseract ${imagePath} stdout --oem 1 --psm 6 -l bul+eng --dpi 300 -c preserve_interword_spaces=1`
    );
    return stdout.trim();
}


async function evaluatePrompts(extractedText) {
    const results = {};
    for (const [promptName, prompt] of Object.entries(prompts)) {
        console.log(`Testing "${promptName}" prompt...`);
        const { latinBlock, cyrillicBlock } = splitOcrByScript(extractedText);
        const gender = inferGender(extractedText);
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "mistral",
            // prompt: `${prompt}\n${extractedText}`,
            // prompt: `${prompt}\n\nOCR LATIN TEXT:\n${latinBlock}\n\nOCR CYRILLIC TEXT:\n${cyrillicBlock}`,
            prompt: `${prompt}\n\nOCR LATIN TEXT:\n${latinBlock}\n\nOCR CYRILLIC TEXT:\n${cyrillicBlock}\n\nHINT: gender = "${gender}"`,
            stream: false,
        });

        try {
            results[promptName] = JSON.parse(
                response.data.response.replace(/```json|```/g, '').trim()
            );
        } catch {
            results[promptName] = response.data.response;
        }
    }
    return results;
}

async function main() {
    const imagePath = "../mock/personal_image.png";
    const extractedText = await extractTextFromImage(imagePath);
    console.log("OCR Text:\n", extractedText, "\n", "=".repeat(80), "\n");

    const results = await evaluatePrompts(extractedText);
    console.table(results);
}

function splitOcrByScript(text) {
    const latinLines = [];
    const cyrillicLines = [];

    for (const line of text.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const cyrillicMatch = /[А-Яа-яЁё]/.test(trimmed);
        (cyrillicMatch ? cyrillicLines : latinLines).push(trimmed);
    }

    return {
        latinBlock: latinLines.join('\n'),
        cyrillicBlock: cyrillicLines.join('\n')
    };
}

main().catch((error) => console.error("Error:", error.message));
