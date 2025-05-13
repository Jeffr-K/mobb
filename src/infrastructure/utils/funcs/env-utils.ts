import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 환경 변수 파일을 로드하는 함수
 * @param envPath 환경 변수 파일의 상대 경로 (기본값: './infrastructure/configs/.dev.env')
 * @returns 로드된 환경 변수 객체
 */
export function loadEnvFile(envPath: string = './infrastructure/configs/.dev.env'): NodeJS.ProcessEnv {
  const absolutePath = path.resolve(process.cwd(), envPath);

  if (fs.existsSync(absolutePath)) {
    const result = dotenv.config({ path: absolutePath });

    if (result.error) {
      console.warn(`⚠️ Error loading environment file ${absolutePath}: ${result.error.message}`);
    } else {
      console.log(`✅ Loaded environment variables from ${absolutePath}`);
    }
  } else {
    console.warn(`⚠️ Environment file ${absolutePath} not found. Using existing environment variables.`);
  }

  return process.env;
}

/**
 * 환경 변수 값을 가져오는 함수
 * @param key 환경 변수 키
 * @param defaultValue 환경 변수가 없을 경우 사용할 기본값
 * @returns 환경 변수 값 또는 기본값
 */
export function getEnv(key: string, defaultValue?: string): string {
  return process.env[key] || defaultValue || '';
}

/**
 * 어플리케이션 시작 시 환경 변수 로드
 */
export function loadEnv(): void {
  loadEnvFile();

  const nodeEnv = process.env.NODE_ENV || 'development';
  if (nodeEnv !== 'development') {
    loadEnvFile(`./infrastructure/configs/.${nodeEnv}.env`);
  }
}
