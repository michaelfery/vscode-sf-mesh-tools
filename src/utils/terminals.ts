'use strict';
import * as constants from "../constants";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let singleTerminal: vscode.Terminal | undefined;

export function getTerminal(): vscode.Terminal {
    if (singleTerminal) {
        return singleTerminal;
    }
    else {
        let terminal = (<any>vscode.window).createTerminal(constants.config.terminalName);
        singleTerminal = terminal;
        return <vscode.Terminal>singleTerminal;
    }
}

export function forgetTerminal() {
    singleTerminal = undefined;
}