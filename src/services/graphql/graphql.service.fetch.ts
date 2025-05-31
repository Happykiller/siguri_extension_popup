// src\services\graphql\graphql.service.fetch.ts
import { contextStore } from "@src/component/store/contextStore";
import config from "@src/common/config";
import { GraphqlService } from "@happykiller/sunny-ui";


export class GraphqlServiceFetch2 implements GraphqlService {
  constructor(
    private inversify: any
  ) {}

  async send(datas: any): Promise<any> {
    try {
      const access_token = contextStore.getState().access_token;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (access_token) {
        headers['Authorization'] = `Bearer ${access_token}`;
      }

      const response = await fetch(`${config.api_url}/graphql`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers,
        body: JSON.stringify(datas),
      });

      return await response.json();
    } catch (e: any) {
      this.inversify.loggerService.error(`GraphqlServiceFetch#send => ${e.message}`);
    }
  }
}
