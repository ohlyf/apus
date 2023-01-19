import { PACKAGE_ROOT } from './constants/index';
/**
 * dev serve的初始化方法
 */
import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-apus/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';

export async function createDevServer(root: string) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config);
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
