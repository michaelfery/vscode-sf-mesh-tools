'use strict';
import * as constants from "../constants";
import * as terminals from "../utils/terminals";
import DeploymentProfile from '../utils/deployment-profile';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export async function deployToAzure() {
    var fs = require('fs');
    const cloudProfile: vscode.Uri[] = await vscode.workspace.findFiles('**/' + constants.config.deploymentFileName);
    const pathToCloudProfile = cloudProfile[0].fsPath.replace('/c:', '');

    await fs.readFile(pathToCloudProfile, 'utf8', function (err: NodeJS.ErrnoException, data: string) {
        if (err) {
            throw err;
        }
        let deploymentProfile = Object.assign(new DeploymentProfile, JSON.parse(data));

        if (deploymentProfile.ResourceGroup === undefined || deploymentProfile.ResourceGroup.length <= 0) {
            vscode.window.showWarningMessage('Deployment file is missing parameter ResourceGroup');
        }
        else if (deploymentProfile.ResourceGroupLocation === undefined || deploymentProfile.ResourceGroupLocation.length <= 0) {
                vscode.window.showWarningMessage('Deployment file is missing parameter ResourceGroupLocation');
        } else if ((deploymentProfile.TemplateUri === undefined || deploymentProfile.TemplateUri.length <= 0) &&
            (deploymentProfile.TemplateFile === undefined || deploymentProfile.TemplateFile.length <= 0)) {
            vscode.window.showWarningMessage('TemplateFile or TemplateUri must be set in deployment file');
        } else if ((deploymentProfile.TemplateUri !== undefined && deploymentProfile.TemplateUri.length > 0 &&
            deploymentProfile.TemplateFile !== undefined && deploymentProfile.TemplateFile.length > 0)) {
            vscode.window.showWarningMessage('TemplateFile and TemplateUri cannot be both set in deployment file');
        } else {
            let terminal = terminals.getTerminal();
            terminal.show(true);
            if (deploymentProfile.SubscriptionId !== undefined && deploymentProfile.SubscriptionId.length > 0) {
                terminal.sendText("az account set --subscription " + deploymentProfile.SubscriptionId, true);
            }
            if (deploymentProfile.SubscriptionId !== undefined && deploymentProfile.SubscriptionId.length > 0) {
                terminal.sendText("az group create --name " + deploymentProfile.ResourceGroup + " --location " + deploymentProfile.ResourceGroupLocation, true);
            }
            if (deploymentProfile.TemplateUri !== undefined && deploymentProfile.TemplateUri.length > 0) {
                terminal.sendText("az mesh deployment create --resource-group " + deploymentProfile.ResourceGroup + " --template-uri " + deploymentProfile.TemplateUri + " --parameters '" + JSON.stringify(deploymentProfile.InlineParameters).replace(/"/g, '\\"') + "'", true);
            } else {
                terminal.sendText("az mesh deployment create --resource-group " + deploymentProfile.ResourceGroup + " --template-file " + deploymentProfile.TemplateFile + " --parameters '" + JSON.stringify(deploymentProfile.InlineParameters).replace(/"/g, '\\"') + "'", true);
            }
        }
    });
}