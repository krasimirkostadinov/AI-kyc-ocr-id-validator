import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "../../store/store";
import ImageUploadForm from "../ImageUploadForm/ImageUploadForm";
import { describe, expect, test, beforeEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("../ImageUploadForm/api", () => ({
  uploadImage: vi.fn(() => Promise.resolve({ success: true })),
}));

describe("ImageUploadForm", () => {
  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => "mocked-image-url");
  });

  beforeEach(() => {
    render(
      <Provider store={store}>
        <ImageUploadForm />
      </Provider>
    );
  });

  test("renders upload form elements", () => {
    expect(screen.getByText(/Upload Document/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Image/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Upload/i })).toBeInTheDocument();
  });

  test("validates file size - too large", async () => {
    const file = new File([""], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 3 * 1024 * 1024 }); // 3MB

    const input = screen.getByLabelText(/Select Image/i);
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/File size too large/i)).toBeInTheDocument();
    });
  });

  test("validates file type - invalid format", async () => {
    const file = new File([""], "test.txt", { type: "text/plain" });

    const input = screen.getByLabelText(/Select Image/i);
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
    });
  });

  test("accepts valid image file", async () => {
    const file = new File(["image content"], "test.jpg", {
      type: "image/jpeg",
    });
    Object.defineProperty(file, "size", { value: 1 * 1024 * 1024 }); // 1MB

    const input = screen.getByLabelText(/Select Image/i);
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(
        screen.queryByText(/File size too large/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Unsupported file format/i)
      ).not.toBeInTheDocument();
    });
  });

  test("disables submit button while uploading", async () => {
    const file = new File(["image content"], "test.jpg", {
      type: "image/jpeg",
    });

    const input = screen.getByLabelText(/Select Image/i);
    await userEvent.upload(input, file);

    const submitButton = screen.getByRole("button", { name: /Upload/i });
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Uploading/i)).toBeInTheDocument();
  });
});
