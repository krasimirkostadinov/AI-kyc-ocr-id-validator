import { ExpectedKYC } from "../features/ocr/types";

/**
 * Compute the match percentage between extracted and expected KYC data.
 * @param extractedData - The extracted KYC data.
 * @param expectedData - The expected KYC data.
 * @returns The match percentage as a string.
 */
export const computeMatchPercentage = (
  extractedData: Partial<ExpectedKYC>,
  expectedData: ExpectedKYC
): string => {
  const totalFields = Object.keys(expectedData).length;
  const matchedFields = Object.keys(expectedData).filter(
    (key) =>
      extractedData[key as keyof ExpectedKYC] &&
      expectedData[key as keyof ExpectedKYC]?.toLowerCase() ===
        extractedData[key as keyof ExpectedKYC]?.toLowerCase()
  ).length;

  return ((matchedFields / totalFields) * 100).toFixed(2) + "%";
};
