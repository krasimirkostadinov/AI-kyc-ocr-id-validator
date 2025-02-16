import * as yup from "yup";

export interface FormData {
  image: FileList;
}

// Validation schema
export const uploadSchema = yup.object().shape({
  image: yup
    .mixed<FileList>()
    .required("Image is required")
    .test("fileSize", "File size too large", (value: FileList | undefined) =>
      value && value.length > 0 ? value[0].size <= 2 * 1024 * 1024 : false
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value: FileList | undefined) =>
        value && value.length > 0
          ? ["image/jpeg", "image/png"].includes(value[0].type)
          : false
    ),
});
