import { defineConfig } from "vite";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = fileURLToPath(new URL("./frontend", import.meta.url));
const distRoot = fileURLToPath(new URL("./dist", import.meta.url));

function isHtmlRequest(req) {
  const method = req.method || "GET";
  const accept = req.headers.accept || "";
  const urlPath = (req.url || "/").split("?")[0];

  if (method !== "GET" && method !== "HEAD") {
    return false;
  }

  if (urlPath.startsWith("/@") || urlPath.startsWith("/__vite")) {
    return false;
  }

  return (
    accept.includes("text/html") ||
    !extname(urlPath) ||
    extname(urlPath) === ".html"
  );
}

function hasExistingFile(urlPath, rootDir) {
  const safePath = decodeURIComponent(urlPath.split("?")[0] || "/");
  const relativePath = safePath === "/" ? "index.html" : safePath.replace(/^\/+/, "");
  const filePath = normalize(join(rootDir, relativePath));
  const normalizedRoot = normalize(rootDir);

  if (!filePath.startsWith(normalizedRoot)) {
    return false;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return true;
  }

  const indexPath = join(filePath, "index.html");
  return existsSync(indexPath) && statSync(indexPath).isFile();
}

function notFoundFallbackPlugin() {
  return {
    name: "aqts-404-fallback",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!isHtmlRequest(req) || hasExistingFile(req.url || "/", frontendRoot)) {
          next();
          return;
        }

        try {
          const template = readFileSync(join(frontendRoot, "404.html"), "utf-8");
          const html = await server.transformIndexHtml("/404.html", template);

          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        } catch (error) {
          next(error);
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!isHtmlRequest(req) || hasExistingFile(req.url || "/", distRoot)) {
          next();
          return;
        }

        try {
          const html = readFileSync(join(distRoot, "404.html"), "utf-8");

          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig({
  // Указываем папку frontend как корневую для нашего сервера
  root: "./frontend",
  plugins: [notFoundFallbackPlugin()],

  server: {
    port: 5173,
    open: true, // Автоматически открывать браузер при запуске
  },

  build: {
    // Папка для сборки готового проекта будет создана на уровне выше frontend
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(frontendRoot, "index.html"),
        notFound: resolve(frontendRoot, "404.html"),
      },
    },
  },
});
