// Compila l'app web dentro la cartella www/ (poi Capacitor la mette nell'APK).
import { build } from "esbuild";
import { mkdirSync, copyFileSync } from "node:fs";

mkdirSync("www", { recursive: true });
await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  minify: true,
  target: "chrome87",
  outfile: "www/app.js",
  logLevel: "info"
});
copyFileSync("src/index.html", "www/index.html");
console.log("Build completata in www/");
