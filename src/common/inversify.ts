// src\common\inversify.ts
import config from '@src/common/config';
import { GetThingUsecase } from '@usecase/getThing/getThing.usecase';
import { GetChestUsecase } from '@usecase/getChest/getChest.usecase';
import { GetChestsUsecase } from '@usecase/getChests/getChests.usecase';
import { GetThingsUsecase } from '@usecase/getThings/getThings.usecase';
import { GraphqlServiceFetch } from '@services/graphql/graphql.service.fetch';
import { SearchThingsUsecase } from '@usecase/searchThings/searchThings.usecase';
import { GeneratePasswordUsecase } from '@usecase/generatePassword/generatePassword.usecase';
import { LoggerService, GraphqlService, SystemInfoUsecase, LoggerServiceReal, GraphqlServiceFake, SessionInfoUsecase } from '@happykiller/sunny-ui';

export class Inversify {
  loggerService: LoggerService;
  graphqlService: GraphqlService;
  getThingUsecase: GetThingUsecase;
  getChestUsecase: GetChestUsecase;
  getChestsUsecase: GetChestsUsecase;
  getThingsUsecase: GetThingsUsecase;
  systemInfoUsecase: SystemInfoUsecase;
  sessionInfoUsecase: SessionInfoUsecase;
  searchThingsUsecase: SearchThingsUsecase;
  generatePasswordUsecase: GeneratePasswordUsecase;

  constructor() {
    // Usecases
    this.getChestUsecase = new GetChestUsecase(this);
    this.getThingUsecase = new GetThingUsecase(this);
    this.getThingsUsecase = new GetThingsUsecase(this);
    this.getChestsUsecase = new GetChestsUsecase(this);
    this.systemInfoUsecase = new SystemInfoUsecase(this);
    this.sessionInfoUsecase = new SessionInfoUsecase(this);
    this.searchThingsUsecase = new SearchThingsUsecase(this);
    this.generatePasswordUsecase = new GeneratePasswordUsecase(this);

    // Services
    this.loggerService = new LoggerServiceReal();
    if (config.mode === 'prod') {
      this.graphqlService = new GraphqlServiceFetch(this);
    } else {
      this.graphqlService = new GraphqlServiceFake();
    }

  }
}

const inversify = new Inversify();

export default inversify;