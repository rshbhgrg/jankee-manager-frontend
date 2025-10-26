/// <reference types="vite/client" />

/**
 * Type definitions for environment variables
 * Access via import.meta.env.VITE_*
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
