export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {      
        NODE_ENV?:'development';
        FRONTEND_PORT:number;
    }
  }
}
