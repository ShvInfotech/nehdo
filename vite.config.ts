// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   base: '/nehdo/',
//   plugins: [react()],
//   server: {
//     port: 5173,
//     strictPort: true,
//     host: true, // Listen on all local IPs
//     // headers: {
//     //   'Cross-Origin-Opener-Policy': 'same-origin',
//     //   'Cross-Origin-Embedder-Policy': 'credentialless'
//     // }
//   }
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/nehdo/",
    plugins: [react()],

    server: {
        port: 5173,
        strictPort: true,
        host: true,
        allowedHosts: true,
    },
});