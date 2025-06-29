// src\usecase\searchThings\searchThings.usecase.ts
import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import SearchThingsUsecaseDto from '@usecase/searchThings/searchThings.usecase.dto';
import SearchThingsUsecaseModel from '@usecase/searchThings/searchThings.usecase.model';

export class SearchThingsUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: SearchThingsUsecaseDto): Promise<SearchThingsUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'search_things',
          variables: dto,
          query: `query search_things($query: String!) {
            search_things (
              dto: {
                query: $query
              }
            ) 
            {
              id
              chest_id
              chest_label
              type
              snippet
            }
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.search_things
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.SEARCH_THINGS_FAIL,
          error: e.message
        }
      }
    }
  }
}