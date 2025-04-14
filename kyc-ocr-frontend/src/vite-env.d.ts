interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly MODE: string;
  readonly VITE_GOOGLE_VISION_API_KEY: string;
  readonly VITE_GOOGLE_CLOUD_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
