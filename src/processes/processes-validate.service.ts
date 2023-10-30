import { Injectable } from '@nestjs/common';
import { Activity, Process as ProcessDocument, VariableType } from 'src/schemas/process.schema';
import { ProcessValidationFailedException } from 'src/common/exceptions';
import { ActivityPackage, ActivityTemplate, Argument, ConnectionArgument, SpecialArgumentType, TemplateType } from 'src/schemas/activity-package.schema';
import { ConnectionService } from 'src/connection/connection.service';
import { AuthorizationProvider } from 'src/entities/connection.entity';
import { ActivityPackagesService } from 'src/activity-packages/activity-packages.service';

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

  async validateProcess(userId: number, processDocument: ProcessDocument) {
    this.validateType(processDocument);
    this.validateSingleEntryPoint(processDocument);
    this.validateFlow(processDocument);
    await this.validateVariables(userId, processDocument);
    await this.validateActivities(userId, processDocument.activities, processDocument);
  }

  private validateType(processDocument: ProcessDocument) {
    if (!(processDocument instanceof ProcessDocument)) {
      throw new ProcessValidationFailedException('Process must be an instance of ProcessDocument');
    }
  }

  private validateSingleEntryPoint(processDocument: ProcessDocument) {
    const entryPoints = processDocument.activities.filter((activity) => activity.prev.length === 0);
    if (entryPoints.length !== 1) {
      throw new ProcessValidationFailedException('Process must have exactly one entry point');
    }
  }

  private validateFlow(processDocument: ProcessDocument) {
    const activities = processDocument.activities;
    const visited = new Set();
    const queue = [activities[0]];

    while (queue.length > 0) {
      const activity = queue.shift();
      if (visited.has(activity.activityId)) {
        throw new ProcessValidationFailedException('Process must not have cycles');
      }
      visited.add(activity.activityId);
      if (activity.type === TemplateType.GATEWAY) {
        this.validateFlowGateway(activity);
      }

      if (typeof activity.next === 'string') {
        queue.push(activities.find((a) => a.activityId === activity.next));
      } else {
        const nextTrueId = activity.next.true;
        const nextFalseId = activity.next.false;
        queue.push(activities.find((a) => a.activityId === nextTrueId));
        queue.push(activities.find((a) => a.activityId === nextFalseId));
      }
    }

    if (visited.size !== activities.length) {
      throw new ProcessValidationFailedException('Process must not have isolated activities');
    }
  }

  private validateFlowGateway(activity: Activity) {
    if (typeof activity.next === 'string') {
      throw new ProcessValidationFailedException('Gateway must have multiple next activities');
    }
  }

  private async validateVariables(userId: number, processDocument: ProcessDocument) {
    for (const variableName in processDocument.variables) {
      const variable = processDocument.variables[variableName];
      if (!variable.isArgument && variable.type.startsWith('connection')) {
        await this.validateConnectionArgument(userId, { type: variable.type, value: variable.defaultValue });
      }

      if (!variable.isArgument && variable.type === VariableType.FILE) {
        await this.validateFileArgument(userId, variable.defaultValue);
      }
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

  private async validateFileArgument(userId: number, fileId: string) {
    // TODO: validate file argument after implementing file storage
  }

  private async validateActivities(userId: number, activities: Activity[], processDocument: ProcessDocument) {
    for (const activity of activities) {
      const activityTemplate = this.getActivityTemplate(activity);
      await this.validateActivity(userId, activity, activityTemplate, processDocument);
    }
  }

  private getActivityTemplate(activity: Activity) {
    const activityPackage = this.activityPackages.find((p) => p._id === activity.packageId);
    const activityTemplate = activityPackage.activityTemplates.find((t) => t.templateId === activity.templateId);
    return activityTemplate;
  }

  private async validateActivity(userId: number, activity: Activity, activityTemplate: ActivityTemplate, processDocument: ProcessDocument) {
    for (const argumentName in activityTemplate.arguments) {
      if (Object.keys(activity.arguments).indexOf(argumentName) === -1) {
        throw new ProcessValidationFailedException(`Activity ${activity.activityId} is missing argument ${argumentName}`);
      }

      const argumentTemplate = activityTemplate.arguments[argumentName];
      const argument = activity.arguments[argumentName];
      await this.validateArgument(userId, argument, argumentTemplate, processDocument);
    }

    for (const returnName in activity.return) {
      if (Object.keys(activityTemplate.return).indexOf(returnName) === -1) {
        throw new ProcessValidationFailedException(`The return ${returnName} of activity ${activity.activityId} is not defined in the template`);
      }

      const variableName = activity.return[returnName];
      if (!processDocument.variables[variableName]) {
        throw new ProcessValidationFailedException(`Variable ${variableName} not found`);
      }
    }

    if (activity.type === TemplateType.SUBPROCESS) {
      await this.validateActivities(userId, activity.body, processDocument);
    }
  }

  private async validateArgument(userId: number, argument: Argument, argumentTemplate: Argument, processDocument: ProcessDocument) {
    if (argument.type !== argumentTemplate.type && argument.type !== SpecialArgumentType.VARIABLE) {
      throw new ProcessValidationFailedException(`Argument ${argument} is of wrong type`);
    }

    if (argument.type === SpecialArgumentType.VARIABLE) {
      await this.validateVariableArgument(userId, argument, argumentTemplate, processDocument);
    } else if (argument.type.startsWith('connection')) {
      await this.validateConnectionArgument(userId, argument);
    } else if (argument.type === VariableType.FILE) {
      await this.validateFileArgument(userId, argument.value);
    }
  }

  private async validateVariableArgument(userId: number, argument: Argument, argumentTemplate: Argument, processDocument: ProcessDocument) {
    const variableName = argument.value;
    if (!processDocument.variables[variableName]) {
      throw new ProcessValidationFailedException(`Variable ${variableName} not found`);
    }

    const variable = processDocument.variables[variableName];
    if (variable.isArgument) return;
    await this.validateArgument(userId, {
      type: variable.type,
      value: variable.defaultValue,
    }, argumentTemplate, processDocument);
  }
}
