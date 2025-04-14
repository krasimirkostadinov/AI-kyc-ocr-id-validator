import { ExpectedKYC } from "./types";
import { computeMatchPercentage } from "../../utils/kycMatcher";
import axios from "axios";

const API_CONFIG = {
    BASE_URL: import.meta.env.MODE === "development" 
        ? 'http://localhost:5001'
        : import.meta.env.VITE_BACKEND_URL,
    ENDPOINTS: {
        OCR: '/api/ocr'
    }
};

/**
 * Extracts text from an image using the local backend API with LLM.
 * @param imageFile - The uploaded image file.
 * @returns Recognized text and analyzed data from the image.
 */
export const extractTextFromImage = async (
  imageFile: File,
  expectedKYC: ExpectedKYC
): Promise<{
  extractedData: Partial<ExpectedKYC>;
  matchSummary: {
    percentage: string;
    matched: string[];
    mismatched: string[];
  };
}> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.OCR}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    const { analyzedData } = response.data;
    console.log("analyzedData", analyzedData);
    
    const extractedData: Partial<ExpectedKYC> = {
      fullName: analyzedData.fullName,
      givenName: analyzedData.givenName,
      middleName: analyzedData.middleName,
      surname: analyzedData.surname,
      nationality: analyzedData.nationality,
      dateOfBirth: analyzedData.dateOfBirth,
      gender: analyzedData.gender,
      personalNo: analyzedData.personalNo,
      documentNo: analyzedData.documentNo,
      expiryDate: analyzedData.expiryDate
    };

    const matchSummary = computeMatchPercentage(extractedData, expectedKYC);

    return { extractedData, matchSummary };
  } catch (error: unknown) {
    console.error("Error extracting text from image:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw new Error("Failed to extract text from image.");
  }
};
