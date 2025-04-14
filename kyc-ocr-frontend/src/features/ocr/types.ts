export interface ExpectedKYC {
  fullName: string;
  surname: string; 
  givenName: string; 
  middleName?: string; 
  nationality: string; 
  dateOfBirth: string; // Format: DD.MM.YYYY
  gender: string; // Gender (M/F)
  personalNo: string; // EGN (Personal ID Number)
  documentNo: string; // ID Document Number
  expiryDate: string; 
}

/**
 * Expected KYC data for testing purposes.
 * This could be replaced with a real KYC data from CRM API, or a database.
 */
export const expectedKYC: ExpectedKYC = {
  givenName: "IVANOVA",
  middleName: "GEORGIEVA",
  surname: "IVANOVA",
  fullName: "IVANOVA GEORGIEVA", //"Slavina Georgieva IVANOVA",
  nationality: "БЪЛГАРИЯ",
  dateOfBirth: "01.08.1995",
  gender: "",
  personalNo: "1336502033", // "9508010133",
  documentNo: "AA0000000",
  expiryDate: "17.06.2034",
};