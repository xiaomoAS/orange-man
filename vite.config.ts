import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  // 根据环境设置base路径
  let base = '/'
  if (mode === 'development') {
    base = env.VITE_BASE_PATH || '/'
  } else if (mode === 'test') {
    base = env.VITE_BASE_PATH || '/test/'
  } else {
    base = env.VITE_BASE_PATH || '/'
  }

  return {
    base,
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: 'localhost',
    },
    define: {
      // 将环境变量注入到客户端代码中
      __APP_ENV__: JSON.stringify(env),
    },
  }
})
