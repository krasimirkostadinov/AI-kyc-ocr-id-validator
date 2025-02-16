import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const backendUrl =
      import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : import.meta.env.VITE_BACKEND_URL;
    const { data } = await axios.get(`${backendUrl}/get-google-token`);
    return data.access_token;
  } catch (error) {
    console.error("Failed to get Google Cloud access token:", error);
    return null;
  }
};

export const detectText = async (base64Image: string, accessToken: string) => {
  const payload = {
    requests: [
      {
        image: { content: base64Image.split(",")[1] },
        features: [{ type: "TEXT_DETECTION" }],
      },
    ],
  };

  return axios.post(GOOGLE_VISION_API_URL, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=utf-8",
      "x-goog-user-project": import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID,
    },
  });
};
