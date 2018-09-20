'use strict';
import * as path from "path";
import * as constants from "../constants";
import * as fileUtils from '../utils/file';
import DeploymentProfile from '../utils/deployment-profile';
import { window } from 'vscode';
import { getWorkingFolder } from '../utils/workspace';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export async function createDeploymentProfile(templateFile: string, templateUri: string) {
	const cwd = await getWorkingFolder();
	if (!cwd) {
		window.showErrorMessage('Please open a workspace directory first.');
		return;
    }
    var configuration = vscode.workspace.getConfiguration(constants.config.projectName);
    let deployment = new DeploymentProfile();
    deployment.SubscriptionId = configuration.get<string>(constants.config.defaultSubscriptionId);
    deployment.ResourceGroup = configuration.get<string>(constants.config.defaultResourceGroup);
    deployment.ResourceGroupLocation = configuration.get<string>(constants.config.defaultResourceGroupLocation);
    if (templateUri === undefined && templateUri === undefined) {
        // prompt user for template Path Uri (filled with default value)
        const pick = await vscode.window.showQuickPick(
            [
                { label: 'Local File', description: 'Local File', target: 'local' },
                { label: 'Uri', description: 'Http or Https link', target: 'uri' }
            ],
            { placeHolder: 'Select the type of location for the creation template.' });
        if (pick === undefined) {
            return;
        }
        if (pick.target == "uri") {
            templateUri = await vscode.window.showInputBox({
                placeHolder: "Http or Https link of creation template.",
                value: configuration.get<string>(constants.config.defaultTemplateUri)
              });
        }
        else {
            // let the user select the creation template file
            const options: vscode.OpenDialogOptions = {
                canSelectFolders: false,
                canSelectFiles: true,
                canSelectMany: false,
                openLabel: 'Select',
                filters: {
                   'Json files': ['Json'],
                   'All files': ['*']
               }
           };
           await vscode.window.showOpenDialog(options).then(fileUri => {
               if (fileUri && fileUri[0]) {
                   templateFile = fileUri[0].fsPath
               }
           });
           if (templateFile === undefined) {
               return;
           }
        }
    }
    if (templateFile !== undefined) {
        deployment.TemplateFile = templateFile;
    }
    if (templateUri !== undefined) {
        deployment.TemplateUri = templateUri;
    }
    deployment.InlineParameters = configuration.get<JSON>(constants.config.defaultParameters);
    let json = JSON.stringify(deployment, undefined, 4);
    let filePath: string;
    filePath = path.join(<string>vscode.workspace.rootPath, 'deploy', constants.config.deploymentFileName);
    await fileUtils.createFolder(path.join(<string>vscode.workspace.rootPath, 'deploy'));
    await fileUtils.write(filePath, json);
    await vscode.window.showInformationMessage('Deployment profile was written in ' + filePath);
}