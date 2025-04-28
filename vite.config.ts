import { defineConfig } from "vite";

export default defineConfig({
    base: "/js/game/supplement/crossword/", // 새로운 배포 경로 설정
    server: {
        port: 3000, // 개발 서버 포트 (원하는 포트로 변경 가능)
        open: true, // 개발 서버 시작 시 브라우저 자동 열기
    },
    build: {
        outDir: "dist", // 빌드 결과물 디렉토리
        sourcemap: true, // 소스맵 생성 (디버깅용)
    },
});
