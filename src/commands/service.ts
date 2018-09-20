'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { generatorProject } from '../yo';
import { createDeploymentProfile } from './create-deployment-profile';
import * as terminals from "../utils/terminals";
import * as constants from "../constants";

export async function addService() {
    var success = await generatorProject(true);
    if (success === true)
    {
        await createDeploymentProfile('deploy/mesh.template.json', '');
    }
}

export async function listAppServices() {
    var terminal = terminals.getTerminal();
    var fs = require('fs');

    let deployResourceGroupName = "";
    const cloudProfiles: vscode.Uri[] = await vscode.workspace.findFiles('**/deploy/' + constants.config.deploymentFileName);
    if (cloudProfiles !== undefined && cloudProfiles.length > 0) {
        const pathToCloudProfile = cloudProfiles[0].fsPath.replace('/c:', '');
        const cloudProfileContent = fs.readFileSync(pathToCloudProfile).toString('utf8');
        if (cloudProfileContent !== undefined && cloudProfileContent.length > 0) {
            let profileContent = JSON.parse(cloudProfileContent);
            deployResourceGroupName = profileContent.ResourceGroup;
        }
    }
    var resourceGroupName = await vscode.window.showInputBox({ value: deployResourceGroupName, prompt: "Resource Group", placeHolder: "resource-group-name", password: false });
    if (resourceGroupName == undefined || resourceGroupName.length <= 0) {
        vscode.window.setStatusBarMessage("no resource group provided");
    }
    else {
        let lastCreatedAppName = "";
        const yoRcFiles: vscode.Uri[] = await vscode.workspace.findFiles('.yo-rc.json');
        if (yoRcFiles !== undefined && yoRcFiles.length > 0) {
            const pathToYoRcFile = yoRcFiles[0].fsPath.replace('/c:', '');
            const yoRcFileContent = fs.readFileSync(pathToYoRcFile).toString('utf8');
            if (yoRcFileContent !== undefined && yoRcFileContent.length > 0) {
                let yoContent = JSON.parse(yoRcFileContent);
                lastCreatedAppName = yoContent["generator-azuresfmesh"].projName;
            }
        }
        var appName = await vscode.window.showInputBox({ value: lastCreatedAppName, prompt: "App Name", placeHolder: "app-name", password: false });
        if (appName == undefined || appName.length <= 0) {
            vscode.window.setStatusBarMessage("no app name provided");
        }
        else {
            terminal.show();
            terminal.sendText("az mesh service list --resource-group " + resourceGroupName + " --app-name " + appName + " -o table", true);
        }
    }
}