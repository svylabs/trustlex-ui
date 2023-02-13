import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      _stream_duplex:
                'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
      _stream_passthrough:
                'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      _stream_readable:
                'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      _stream_writable:
                'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      _stream_transform:
                'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6'
    },
  },
  worker: {
    format: "es",
    plugins: [
      wasm()
    ]
  },
  optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                    process: true
                })
            ]
        }
    }
});
