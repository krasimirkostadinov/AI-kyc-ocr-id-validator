import { ExpectedKYC } from "../features/ocr/types";
import { normalizeName } from "./kycExtractor";

/**
 * Compute the match percentage between extracted and expected KYC data.
 * @param extractedData - The extracted KYC data.
 * @param expectedData - The expected KYC data.
 * @returns The match percentage as a string.
 */
export const computeMatchPercentage = (
  extractedData: Partial<ExpectedKYC>,
  expectedData: ExpectedKYC
): {
  percentage: string;
  matched: string[];
  mismatched: string[];
} => {
  const matched: string[] = [];
  const mismatched: string[] = [];

  Object.keys(expectedData).forEach((key) => {
    let expected = expectedData[key as keyof ExpectedKYC]?.toString().toLowerCase().trim();
    let extracted = extractedData[key as keyof ExpectedKYC]?.toString().toLowerCase().trim();

    if (key === "fullName") {
      expected = normalizeName(expected || "");
      
      extracted = normalizeName(extracted || "");
    }

    if (extracted && expected === extracted) {
      matched.push(key);
    } else {
      mismatched.push(key);
    }
  });

  const totalFields = matched.length + mismatched.length;
  const percentage = ((matched.length / totalFields) * 100).toFixed(2) + "%";

  return {
    percentage,
    matched,
    mismatched
  };
};
