export interface ExpectedKYC {
  fullName: string; // First + Last Name
  surname: string; // Last Name (Surname)
  givenName: string; // First Name
  middleName?: string; // Middle Name (if applicable)
  nationality: string; // Nationality (BGR)
  dateOfBirth: string; // Format: DD.MM.YYYY
  gender: string; // Gender (M/F)
  personalNo: string; // EGN (Personal ID Number)
  documentNo: string; // ID Document Number
  expiryDate: string; // Expiry Date
}

/**
 * Expected KYC data for testing purposes.
 * This could be replaced with a real KYC data from CRM API, or a database.
 */
export const expectedKYC: ExpectedKYC = {
  fullName: "Slavina Georgieva Ivanova",
  surname: "IVANOVA",
  givenName: "IVANOVA", //"Slavina",
  middleName: "Georgieva", //"Име"
  nationality: "БЪЛГАРИЯ", //"BGR",
  dateOfBirth: "01.08.1995",
  gender: "F",
  personalNo: "9508010133",
  documentNo: "267503",
  expiryDate: "17.06.2034",
};
