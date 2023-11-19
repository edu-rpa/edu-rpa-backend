import { Injectable } from '@nestjs/common';
import { Activity, VariableType, ProcessForValidation, Variables } from 'src/schemas/process.schema';
import { ProcessValidationFailedException } from 'src/common/exceptions';
import { ActivityPackage, ActivityTemplate, Argument, ArgumentType, ConnectionArgument, FileArgument, ScalarArgument, SpecialArgumentType } from 'src/schemas/activity-package.schema';
import { ConnectionService } from 'src/connection/connection.service';
import { AuthorizationProvider } from 'src/entities/connection.entity';
import { ActivityPackagesService } from 'src/activity-packages/activity-packages.service';
import { validate } from 'class-validator';

// TODO:
// - Validate expression and operator arguments
// - Validate file arguments
// - Validate that: browser activities must be inside a browser subprocess
// - About current item variable in a loop subprocess
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

  async validateProcess(userId: number, process: ProcessForValidation) {
    await this.isOfRequiredFormat(process);
    await this.validateVariables(userId, process.variables, process);
    await this.validateActivities(userId, process.activities, process);
  }

  private async isOfRequiredFormat(process: ProcessForValidation) {
    const errors = await validate(process);
    if (errors.length > 0) {
      throw new ProcessValidationFailedException(errors.toString());
    }
  }

  private validationMapper(type: ArgumentType) {
    if (type.startsWith('connection')) {
      return this.validateConnectionArgument.bind(this);
    }

    switch (type) {
      case VariableType.FILE:
        return this.validateFileArgument.bind(this);
      case SpecialArgumentType.VARIABLE:
        return this.validateVariableArgument.bind(this);
      case VariableType.STRING:
      case VariableType.NUMBER:
      case VariableType.BOOLEAN:
        return this.validateScalarArgument.bind(this);
      // TODO: add validation cases for other types
      default:
        throw new ProcessValidationFailedException(`Argument type ${type} not supported`);
    }
  }

  private async validateVariables(userId: number, variables: Variables, process: ProcessForValidation) {
    for (const variableName in variables) {
      const variable = variables[variableName];
      if (variable.isArgument) continue;
      const validate = this.validationMapper(variable.type);
      await validate(userId, {
        type: variable.type,
        value: variable.defaultValue,
      }, null, process);
    }  
  }

  private async validateScalarArgument(userId: number, argument: ScalarArgument) {
    if (argument.type === VariableType.FILE) return this.validateFileArgument(userId, argument as FileArgument);
    if (typeof argument.value !== argument.type) {
      throw new ProcessValidationFailedException(`Argument ${argument} is of wrong type`);
    }
  }

  private async validateConnectionArgument(userId: number, connection: ConnectionArgument) {
    const provider = connection.type.split(':')[1];
    const connectionFromRepo = await this.connectionService.getConnection(userId, {
      provider: provider as AuthorizationProvider,
      name: connection.value,
    });
    
    if (!connectionFromRepo) {
      throw new ProcessValidationFailedException(`Connection ${connection.value} not found`);
    }
  }

  private async validateFileArgument(userId: number, file: FileArgument) {
    // TODO: validate file argument after implementing file storage
  }

  private async validateActivities(userId: number, activities: Activity[], process: ProcessForValidation) {
    for (const activity of activities) {
      const activityTemplate = this.getActivityTemplate(activity);
      await this.validateActivity(userId, activity, activityTemplate, process);
    }
  }

  private getActivityTemplate(activity: Activity) {
    const activityPackage = this.activityPackages.find((p) => p._id === activity.packageId);
    if (!activityPackage) {
      throw new ProcessValidationFailedException(`Activity package not found`);
    }

    const activityTemplate = activityPackage.activityTemplates.find((t) => t.templateId === activity.templateId);
    return activityTemplate;
  }

  private async validateActivity(userId: number, activity: Activity, activityTemplate: ActivityTemplate, process: ProcessForValidation) {
    for (const argumentName in activityTemplate.arguments) {
      if (Object.keys(activity.arguments).indexOf(argumentName) === -1) {
        throw new ProcessValidationFailedException(`Activity ${activity.activityId} is missing argument ${argumentName}`);
      }

      const argumentTemplate = activityTemplate.arguments[argumentName];
      const argument = activity.arguments[argumentName];
      await this.validateArgument(userId, argument, argumentTemplate, process);
    }

    for (const returnName in activity.return) {
      if (Object.keys(activityTemplate.return).indexOf(returnName) === -1) {
        throw new ProcessValidationFailedException(`The return ${returnName} of activity ${activity.activityId} is not defined in the template`);
      }

      const variableName = activity.return[returnName];
      if (!process.variables[variableName]) {
        throw new ProcessValidationFailedException(`Variable ${variableName} not found`);
      }
    }

  }

  private async validateArgument(userId: number, argument: Argument, argumentTemplate: Argument, process: ProcessForValidation) {
    if (argument.type !== argumentTemplate.type && argument.type !== SpecialArgumentType.VARIABLE) {
      throw new ProcessValidationFailedException(`Argument ${argument} is of wrong type`);
    }

    const validate = this.validationMapper(argument.type);
    await validate(userId, argument, argumentTemplate, process);
  }

  private async validateVariableArgument(userId: number, argument: Argument, argumentTemplate: Argument, process: ProcessForValidation) {
    const variableName = argument.value;
    if (!process.variables[variableName]) {
      throw new ProcessValidationFailedException(`Variable ${variableName} not found`);
    }

    const variable = process.variables[variableName];
    if (variable.isArgument) return;
    await this.validateArgument(userId, {
      type: variable.type,
      value: variable.defaultValue,
    }, argumentTemplate, process);
  }
}
