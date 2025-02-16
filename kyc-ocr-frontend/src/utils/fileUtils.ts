/**
 * Convert a File object to a base64 string.
 * @param file - The file to convert.
 * @returns A Promise that resolves to the base64 string.
 */
export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
