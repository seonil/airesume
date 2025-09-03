import path from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

// FIX: Define __dirname in ES module scope since it's not available by default.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
