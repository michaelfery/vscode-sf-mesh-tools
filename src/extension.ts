'use strict';
import * as constants from "./constants";
import * as terminals from "./utils/terminals";
import { createApplication, listApps } from './commands/application';
import { addService, listAppServices } from './commands/service';
import { listNetworks } from './commands/network';
import { login } from './commands/login';
import { createDeploymentProfile } from './commands/create-deployment-profile';
import { deployToAzure } from './commands/deploy-to-azure';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sf-mesh-tools" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.createApplication', createApplication));
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.addService', addService));
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.login', login));
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.createDeploymentProfile', createDeploymentProfile));
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.deploy', deployToAzure));
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.listApps', listApps));
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.listNetworks', listNetworks));
    context.subscriptions.push(vscode.commands.registerCommand('sfmesh.listAppServices', listAppServices));
    
    vscode.window.onDidCloseTerminal(e => {
        if (e.name === constants.config.terminalName) {
            terminals.forgetTerminal();
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}