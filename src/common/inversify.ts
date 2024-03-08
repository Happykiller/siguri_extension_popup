import config from '@src/common/config';
import { AuthUsecase } from '@usecase/auth/auth.usecase';
import LoggerService from '@service/logger/logger.service';
import GraphqlService from '@service/graphql/graphql.service';
import { GetThingUsecase } from '@usecase/getThing/getThing.usecase';
import { GetChestUsecase } from '@usecase/getChest/getChest.usecase';
import { SystemInfoUsecase } from '@usecase/system/systemInfo.usecase';
import { LoggerServiceReal } from '@service/logger/logger.service.real';
import { GetChestsUsecase } from '@usecase/getChests/getChests.usecase';
import { GetThingsUsecase } from '@usecase/getThings/getThings.usecase';
import { GraphqlServiceFake } from '@service/graphql/graphql.service.fake';
import { SessionInfoUsecase } from '@usecase/sessionInfo/systemInfo.usecase';
import { GraphqlServiceFetch } from '@service/graphql/graphql.service.fetch';

export class Inversify {
  authUsecase: AuthUsecase;
  loggerService: LoggerService;
  graphqlService: GraphqlService;
  sessionInfo: SessionInfoUsecase;
  getThingUsecase: GetThingUsecase;
  getChestUsecase: GetChestUsecase;
  getChestsUsecase: GetChestsUsecase;
  getThingsUsecase: GetThingsUsecase;
  systemInfoUsecase: SystemInfoUsecase;

  constructor() {
    // Usecases
    this.authUsecase = new AuthUsecase(this);
    this.loggerService = new LoggerServiceReal();
    this.sessionInfo = new SessionInfoUsecase(this);
    this.getChestUsecase = new GetChestUsecase(this);
    this.getThingUsecase = new GetThingUsecase(this);
    this.getThingsUsecase = new GetThingsUsecase(this);
    this.getChestsUsecase = new GetChestsUsecase(this);
    this.systemInfoUsecase = new SystemInfoUsecase(this);

    // Services
    if (config.mode === 'prod') {
      this.graphqlService = new GraphqlServiceFetch(this);
    } else {
      this.graphqlService = new GraphqlServiceFake();
    }

  }
}

const inversify = new Inversify();

export default inversify;