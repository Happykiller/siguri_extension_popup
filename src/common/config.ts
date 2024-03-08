class Config {
  mode:string;
  port:string;
  debug:boolean;
  api_url:string;

  constructor(){
    this.port = process.env.APP_PORT??'8080';
    this.mode = process.env.APP_MODE??'prod';
    this.api_url = process.env.APP_API_URL??'https://api.siguri.happykiller.net/graphql';
    this.debug = Boolean(process.env.APP_DEBUG) || false;
  }
}

const config = new Config();

export default config;