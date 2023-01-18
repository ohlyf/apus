import { Plugin } from "vite";
import { readFile } from "fs/promises";
import { DEFAULT_HTML_PATH, CLIENT_ENTRY_PATH } from "../constants";

export function pluginIndexHtml(): Plugin {
  return {
    name: "apus:index-html",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`,
            },
            injectTo: "body",
          },
        ],
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 1. 读取template.html内容
          let content = await readFile(DEFAULT_HTML_PATH, "utf-8");
          content = await server.transformIndexHtml(
            req.url,
            content,
            req.originalUrl
          );
          // 2. 响应html内容给浏览器
          res.setHeader("Content-Type", "text/html");
          res.end(content);
        });
      };
    },
  };
}
