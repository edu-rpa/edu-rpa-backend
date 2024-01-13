import { Injectable } from '@nestjs/common';
import { Activity, VariableType, ProcessForValidation, Variables } from 'src/processes/schema/process.schema';
import { ProcessValidationFailedException } from 'src/common/exceptions';
import { 
  ActivityPackage, 
  ActivityTemplate, 
  Argument, 
  ArgumentType, 
  ConnectionArgument, 
  FileArgument, 
  ScalarArgument, 
  SpecialArgumentType 
} from 'src/activity-packages/schema/activity-package.schema';
import { ConnectionService } from 'src/connection/connection.service';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';
import { ActivityPackagesService } from 'src/activity-packages/activity-packages.service';
import { validate } from 'class-validator';

// TODO: update process schema and implement validation accordingly
// NOTE: this service is not used in the current implementation (temporary)
@Injectable()
export class ProcessesValidateService {
  private activityPackages: ActivityPackage[] = [];

  constructor(
    private readonly connectionService: ConnectionService,
    private readonly activityPackagesService: ActivityPackagesService,
  ) {
    this.activityPackagesService.findAll()
      .then((packages) => {
        this.activityPackages = packages;
      });
  }

}
