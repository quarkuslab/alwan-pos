const babel = require("@rollup/plugin-babel").default;
const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const terser = require("@rollup/plugin-terser");
const typescript = require("@rollup/plugin-typescript");
const postcss = require("rollup-plugin-postcss");
const serve = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");
const fs = require("fs");
const path = require("path");

// Check if we are in production mode
const isProduction = process.env.NODE_ENV === "production";
const extensions = [".js", ".jsx", ".ts", ".tsx"];

// HTML template processing
function processHtml() {
  return {
    name: "html-transform",
    writeBundle(options, bundle) {
      // Find the main entry point file name
      const jsEntryFile = Object.keys(bundle).find(
        (fileName) =>
          fileName.startsWith("js/index") && fileName.endsWith(".js")
      );

      if (!jsEntryFile) {
        console.error("Could not find main entry point file");
        return;
      }

      const htmlContent = fs.readFileSync("index.html", "utf-8");
      // Replace script src with relative path (removed leading slash)
      const updatedHtmlContent = htmlContent.replace(
        /<script.*src=["']\/js\/index\.js["'].*><\/script>/,
        `<script src="${jsEntryFile}"></script>`
      );

      fs.writeFileSync("dist/index.html", updatedHtmlContent);
      console.log(
        `Updated index.html with correct script path: ${jsEntryFile}`
      );
    },
  };
}

// Plugin to handle build completion
function buildCompletePlugin() {
  return {
    name: "build-complete",
    closeBundle() {
      if (isProduction) {
        setTimeout(() => {
          process.exit(0);
        }, 1000);
      }
    },
  };
}

// Common plugins used in both development and production
const commonPlugins = [
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(
      isProduction ? "production" : "development"
    ),
  }),
  typescript({
    tsconfig: "./tsconfig.json",
    sourceMap: true,
    inlineSources: true,
    declaration: false,
  }),
  babel({
    extensions,
    exclude: "node_modules/**",
    babelHelpers: "bundled",
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            ie: "11",
            chrome: "49",
            firefox: "52",
            safari: "9.1",
            edge: "13",
            ios: "9",
          },
          useBuiltIns: "usage",
          corejs: 3,
          modules: false,
        },
      ],
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
  }),
  resolve({
    extensions,
    browser: true,
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  }),
  commonjs({
    include: /node_modules/,
  }),
  postcss({
    config: {
      path: "./postcss.config.js", // Path to your PostCSS config
    },
  }),
  processHtml(),
];

// Production-only plugins
const productionPlugins = [
  terser({
    parse: {
      ecma: 5,
    },
    compress: {
      ecma: 5,
      warnings: false,
      comparisons: false,
      inline: 2,
    },
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true,
    },
  }),
  buildCompletePlugin(),
];

// Development-only plugins
const developmentPlugins = [
  serve({
    contentBase: "dist",
    port: 3000,
    open: true,
  }),
  livereload("dist"),
];

// Create the appropriate configuration based on the environment
const config = {
  input: "src/index.tsx",
  output: {
    dir: "dist",
    entryFileNames: "js/[name].[hash].js",
    chunkFileNames: "js/[name].[hash].js",
    assetFileNames: "assets/[name].[hash][extname]",
    format: "iife",
    sourcemap: true,
    globals: {},
  },
  plugins: [
    ...commonPlugins,
    ...(isProduction ? productionPlugins : developmentPlugins),
  ],
};

// For production, we want the build to exit after completion
if (isProduction) {
  config.watch = false;
}

module.exports = config;
