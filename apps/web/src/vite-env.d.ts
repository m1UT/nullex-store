/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOT_LINK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
