// src\common\inversify.ts
import config from '@src/common/config';
import { GetThingUsecase } from '@usecase/getThing/getThing.usecase';
import { GetChestUsecase } from '@usecase/getChest/getChest.usecase';
import { GetChestsUsecase } from '@usecase/getChests/getChests.usecase';
import { GetThingsUsecase } from '@usecase/getThings/getThings.usecase';
import { GraphqlServiceFetch2 } from '@services/graphql/graphql.service.fetch';
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
  generatePasswordUsecase: GeneratePasswordUsecase;

  constructor() {
    // Usecases
    this.getChestUsecase = new GetChestUsecase(this);
    this.getThingUsecase = new GetThingUsecase(this);
    this.getThingsUsecase = new GetThingsUsecase(this);
    this.getChestsUsecase = new GetChestsUsecase(this);
    this.systemInfoUsecase = new SystemInfoUsecase(this);
    this.sessionInfoUsecase = new SessionInfoUsecase(this);
    this.generatePasswordUsecase = new GeneratePasswordUsecase(this);

    // Services
    this.loggerService = new LoggerServiceReal();
    console.log(config.mode)
    if (config.mode === 'prod') {
      console.log('prod')
      this.graphqlService = new GraphqlServiceFetch2(this);
    } else {
      console.log('other')
      this.graphqlService = new GraphqlServiceFake();
    }

  }
}

const inversify = new Inversify();

export default inversify;