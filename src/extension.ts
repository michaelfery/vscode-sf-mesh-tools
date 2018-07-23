'use strict';
import * as fileUtils from './utils/file';
import * as path from "path";
import * as constants  from "./constants";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let singleTerminal: vscode.Terminal | undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sf-mesh-tools" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.login', login));
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.createDeploymentProfile', createDeploymentProfile));
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.deploy', deployToAzure));

    vscode.window.onDidCloseTerminal(e => {
        if (e.name === constants.config.terminalName) {
            singleTerminal = undefined;
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class DeploymentProfile{
    SubscriptionId?:string;
    ResourceGroup?: string;
    TemplateUri?: string;
    TemplateFile?: string;
    Location?: string;
    InlineParameters?: JSON;
}

async function login() {
    var terminal = getTerminal();
    terminal.show(true);
    terminal.sendText("az login", true);
}

async function createDeploymentProfile() {
    var configuration =  vscode.workspace.getConfiguration(constants.config.projectName);
    let deployment = new DeploymentProfile();
    deployment.SubscriptionId = configuration.get<string>(constants.config.defaultSubscriptionId);
    deployment.ResourceGroup = configuration.get<string>(constants.config.defaultResourceGroup);
    deployment.TemplateUri = configuration.get<string>(constants.config.defaultTemplateUri);
    deployment.TemplateFile = configuration.get<string>(constants.config.defaultTemplateFile);
    deployment.InlineParameters = configuration.get<JSON>(constants.config.defaultParameters);
    let json = JSON.stringify(deployment, undefined, 4);
    
    let filePath = path.join(<string>vscode.workspace.rootPath, constants.config.deploymentFileName);
    await fileUtils.write(filePath, json);
}

async function deployToAzure() {
    var fs = require('fs');
    const cloudProfile: vscode.Uri[] = await vscode.workspace.findFiles('**/' + constants.config.deploymentFileName);
    const pathToCloudProfile = cloudProfile[0].fsPath.replace('/c:', '');

    await fs.readFile(pathToCloudProfile, 'utf8', function (err: NodeJS.ErrnoException, data:string) {
        if (err) {
            throw err;
        }
        let deploymentProfile = Object.assign(new DeploymentProfile, JSON.parse(data));

        if (deploymentProfile.ResourceGroup === undefined || deploymentProfile.ResourceGroup.length <= 0) {
            vscode.window.showInformationMessage('Deployment file is missing parameter ResourceGroup');
        } else if ((deploymentProfile.TemplateUri === undefined || deploymentProfile.TemplateUri.length <= 0) &&
                    (deploymentProfile.TemplateFile === undefined || deploymentProfile.TemplateFile.length <= 0)) {
            vscode.window.showInformationMessage('Deployment file is missing parameter TemplateUri or TemplateFile');
        } else {
            let terminal = getTerminal();
            terminal.show(true);
            if (deploymentProfile.SubscriptionId !== undefined && deploymentProfile.SubscriptionId.length > 0) {
                terminal.sendText("az account set --subscription " + deploymentProfile.SubscriptionId, true);
            }
            if (deploymentProfile.TemplateUri !== undefined && deploymentProfile.TemplateUri.length > 0) {
                terminal.sendText("az mesh deployment create --resource-group "+ deploymentProfile.ResourceGroup + " --template-uri " + deploymentProfile.TemplateUri + " --parameters '" + JSON.stringify(deploymentProfile.InlineParameters).replace(/"/g, '\\"') + "'", true);
            } else {
                terminal.sendText("az mesh deployment create --resource-group "+ deploymentProfile.ResourceGroup + " --template-file " + deploymentProfile.TemplateFile + " --parameters '" + JSON.stringify(deploymentProfile.InlineParameters).replace(/"/g, '\\"') + "'", true);
            }            
        }
    });
}

function getTerminal(): vscode.Terminal {
    if (singleTerminal) {
        return singleTerminal;
    }
    else {
        let terminal = (<any>vscode.window).createTerminal(constants.config.terminalName);
        singleTerminal = terminal;
        return <vscode.Terminal>singleTerminal;    
    }
}