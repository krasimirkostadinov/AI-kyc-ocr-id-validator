import { ExpectedKYC } from "../features/ocr/types";

// Regex patterns for KYC fields
const NAME_PATTERN = /Name\s+([A-ZА-Я]+)\s+([A-ZА-Я]+)/i;
const SURNAME_PATTERN = /Surname\s+([A-ZА-Я]+)/i;
const NATIONALITY_PATTERN = /Nationality\s+([A-ZА-Я]+)/i;
const DOB_PATTERN = /Date of birth\s+(\d{2}.\d{2}.\d{4})/i;
const GENDER_PATTERN = /Gender\s+([MF])/i;
const PERSONAL_NO_PATTERN = /Personal No\s+(\d{10})/i;
const DOCUMENT_NO_PATTERN = /Document number\s+(\w{2}\d+)/i;
const EXPIRY_DATE_PATTERN = /Date of expiry\s+(\d{2}.\d{2}.\d{4})/i;

export const extractKYCData = (ocrText: string): Partial<ExpectedKYC> => {
  const kycData: Partial<ExpectedKYC> = {};

  // Extract values from text
  const nameMatch = ocrText.match(NAME_PATTERN);
  const surnameMatch = ocrText.match(SURNAME_PATTERN);
  const nationalityMatch = ocrText.match(NATIONALITY_PATTERN);
  const dobMatch = ocrText.match(DOB_PATTERN);
  const genderMatch = ocrText.match(GENDER_PATTERN);
  const personalNoMatch = ocrText.match(PERSONAL_NO_PATTERN);
  const documentNoMatch = ocrText.match(DOCUMENT_NO_PATTERN);
  const expiryDateMatch = ocrText.match(EXPIRY_DATE_PATTERN);

  // Assign extracted values
  if (nameMatch) {
    kycData.givenName = nameMatch[1];
    kycData.middleName = nameMatch[2];
  }
  if (surnameMatch) kycData.surname = surnameMatch[1];
  if (nationalityMatch) kycData.nationality = nationalityMatch[1];
  if (dobMatch) kycData.dateOfBirth = dobMatch[1];
  if (genderMatch) kycData.gender = genderMatch[1];
  if (personalNoMatch) kycData.personalNo = personalNoMatch[1];
  if (documentNoMatch) kycData.documentNo = documentNoMatch[1];
  if (expiryDateMatch) kycData.expiryDate = expiryDateMatch[1];

  if (kycData.givenName && kycData.middleName && kycData.surname) {
    kycData.fullName = `${kycData.givenName} ${kycData.middleName} ${kycData.surname}`;
  }

  return kycData;
};
