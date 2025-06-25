import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 개발 서버 설정
    port: 5173, // Vite 기본 포트
    strictPort: true,
    host: '0.0.0.0', // Enable access from any network interface
    // React Router를 위한 History API Fallback 활성화
    historyApiFallback: true,
    // FastAPI 백엔드 프록시 설정 (Docker 환경에서는 fastapi 서비스명 사용)
    proxy: {
      '/api': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 기존 API 경로들을 프록시 (recommendation 등)
      '/recommendation': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      },
      '/search': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      },
      '/assets': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      }
    }
  },
  // 빌드 설정
  build: {
    // 출력 디렉토리 설정
    outDir: 'dist',
    // 정적 파일을 복사할 디렉토리
    assetsDir: 'assets',
    // 청크 크기 경고 임계값 조정
    chunkSizeWarningLimit: 1000,
    // 라이브러리 모드 설정 
    lib: {
      // 독립적으로 실행 가능한 진입점 파일들
      entry: {
        'main': resolve(__dirname, 'src/main.jsx'),
        'slider': resolve(__dirname, 'src/StandaloneSlider.jsx')
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format}.js`
    },
    rollupOptions: {
      // 외부 의존성 설정
      external: ['react', 'react-dom'],
      output: {
        // 글로벌 변수 설정
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
