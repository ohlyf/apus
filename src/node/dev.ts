import { PACKAGE_ROOT } from './constants/index';
/**
 * dev serve的初始化方法
 */
import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-apus/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin-apus/config';

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config.siteData);
  return createServer({
    root,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartServer)
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
