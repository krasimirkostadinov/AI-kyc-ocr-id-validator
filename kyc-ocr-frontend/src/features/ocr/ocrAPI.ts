import { ExpectedKYC } from "./types";
import { extractKYCData } from "../../utils/kycExtractor";
import { computeMatchPercentage } from "../../utils/kycMatcher";
import { detectText } from "../../services/googleVisionService";
import axios from "axios";

/**
 * Extracts text from an image using the Google Vision API.
 * @param imageFile - The uploaded image file.
 * @returns Recognized text from the image.
 */
export const extractTextFromImage = async (
  imageFile: File,
  expectedKYC: ExpectedKYC
): Promise<{
  extractedData: Partial<ExpectedKYC>;
  matchPercentage: string;
}> => {
  try {
    const base64Image = await toBase64(imageFile);
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error("Failed to retrieve access token.");
    }

    const response = await detectText(base64Image, accessToken);
    const annotations = response.data.responses[0]?.textAnnotations;
    const rawText = annotations?.[0]?.description || "";

    if (!rawText) throw new Error("No text found in the image.");

    const extractedData = extractKYCData(rawText);
    const matchPercentage = computeMatchPercentage(extractedData, expectedKYC);

    return { extractedData, matchPercentage };
  } catch (error: unknown) {
    console.error("Error extracting text from image:", error);
    throw new Error("Failed to extract text from image.");
  }
};

/**
 * Convert a File object to a base64 string.
 * @param file - The file to convert.
 * @returns A Promise that resolves to the base64 string.
 */
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

/**
 * Retrieves the Google Cloud authentication token using gcloud CLI.
 * @returns A Promise that resolves to the access token string.
 */
const getAccessToken = async (): Promise<string | null> => {
  try {
    const backendUrl =
      import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : import.meta.env.VITE_BACKEND_URL;
    const { data } = await axios.get(`${backendUrl}/get-google-token`);
    return data.access_token;
  } catch (error) {
    console.error("Failed to get Google Cloud access token:", error);
    return null;
  }
};
