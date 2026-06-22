// env.d.ts - 环境变量类型声明
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      NEXTAUTH_SECRET?: string
      NEXTAUTH_URL?: string
    }
  }
}

export {}
