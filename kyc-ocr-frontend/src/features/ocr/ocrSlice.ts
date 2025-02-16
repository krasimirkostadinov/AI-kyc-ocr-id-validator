import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { extractTextFromImage } from "./ocrAPI";
import { expectedKYC, ExpectedKYC } from "./types";

interface OCRState {
  text: { extractedData: Partial<ExpectedKYC>; matchPercentage: string } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OCRState = {
  text: null,
  status: "idle",
  error: null,
};

export const analyzeImage = createAsyncThunk(
  "ocr/analyzeImage",
  async (imageFile: File, { rejectWithValue }) => {
    try {
      return await extractTextFromImage(imageFile, expectedKYC);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const ocrSlice = createSlice({
  name: "ocr",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(analyzeImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(analyzeImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.text = action.payload;
      })
      .addCase(analyzeImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default ocrSlice.reducer;
