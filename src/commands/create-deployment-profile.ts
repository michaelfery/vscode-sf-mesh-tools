'use strict';
import * as path from "path";
import * as constants from "../constants";
import * as fileUtils from '../utils/file';
import DeploymentProfile from '../utils/deployment-profile';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export async function createDeploymentProfile() {
    var configuration = vscode.workspace.getConfiguration(constants.config.projectName);
    let deployment = new DeploymentProfile();
    deployment.SubscriptionId = configuration.get<string>(constants.config.defaultSubscriptionId);
    deployment.ResourceGroup = configuration.get<string>(constants.config.defaultResourceGroup);
    deployment.ResourceGroupLocation = configuration.get<string>(constants.config.defaultResourceGroupLocation);
    deployment.TemplateUri = configuration.get<string>(constants.config.defaultTemplateUri);
    deployment.TemplateFile = configuration.get<string>(constants.config.defaultTemplateFile);
    deployment.InlineParameters = configuration.get<JSON>(constants.config.defaultParameters);
    let json = JSON.stringify(deployment, undefined, 4);

    let filePath = path.join(<string>vscode.workspace.rootPath, constants.config.deploymentFileName);
    await fileUtils.write(filePath, json);
}