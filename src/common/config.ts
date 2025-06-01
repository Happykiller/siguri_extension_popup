// src\common\config.ts
class Config {
  mode:string;
  port:string;
  debug:boolean;
  api_url:string;
  siguri_url:string;
  local_storage_name:string;
  version: string;

  constructor(){
    this.port = process.env.APP_PORT??'8080';
    this.mode = process.env.APP_MODE??'prod';
    this.api_url = process.env.APP_API_URL??'https://api.siguri.happykiller.net/graphql';
    this.debug = Boolean(process.env.APP_DEBUG) || false;
    this.local_storage_name = 'siguri-storage';
    this.siguri_url = 'https://siguri.happykiller.net';
    this.version = process.env.VERSION??'0.0.0';
  }
}

const config = new Config();

export default config;