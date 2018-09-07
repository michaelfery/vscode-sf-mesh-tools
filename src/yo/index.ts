'use strict';

import { window, workspace, QuickPickItem } from 'vscode';
import Yeoman from './yo/yo';

const azuresfmeshGenerator = 'azuresfmesh';
const opn = require('opn');

async function getWorkingFolder() {
	if (!Array.isArray(workspace.workspaceFolders) || workspace.workspaceFolders.length === 0) {
		return undefined;
	}

	if (workspace.workspaceFolders.length === 1) {
		return workspace.workspaceFolders[0].uri.fsPath;
	}
	const selectedWkFolder = (window as any).showWorkspaceFolderPick();
	return selectedWkFolder ? selectedWkFolder.uri.fspath : undefined;
}

export async function generatorProject(addService) {
	const cwd = await getWorkingFolder();
	if (!cwd) {
		window.showErrorMessage('Please open a workspace directory first.');
		return;
    }

    const yo = new Yeoman({ cwd });
	let main;

	let generators = await list(yo);
	if (generators === undefined || generators.length <= 0){
		return;
	}
	let generator = generators[0];// Only one Service Fabric Mesh generator is used for now
    
	main = generator.label;
	let subGenerator: string;
	if ((generator as any).subGenerators.length > 1 && addService) {
		subGenerator = "addService";
	} else {
		subGenerator = 'app';
	}

	if (subGenerator === undefined) {
		return;
	}

    try {
		const question: string = await yo.run(`${main}:${subGenerator}`, cwd) as string;
		if (!question) {
			return;
		}
		const input = window.showInputBox({ prompt: question });
		if (!input) {
			return;
		}
		const argument = input;
		await yo.run(`${main}:${subGenerator} ${argument}`, cwd);

	} catch (err) {
		const regexp = new RegExp('Did not provide required argument (.*?)!', 'i');

		if (err) {
			const match = err.message.match(regexp);

			if (match) {
				return `${subGenerator} ${match[1]}?`;
			}
		}
		window.showErrorMessage(err.message || err);
	}
}

function list(yo: Yeoman): Promise<QuickPickItem[]> {
	return new Promise((resolve, reject) => {
		setImmediate(() => {
			yo.getEnvironment().lookup(() => {
				const generators = yo.getGenerators().map(generator => {
					return {
						label: generator.name.replace(/(^|\/)generator\-/i, '$1') as string,
						description: generator.description,
						subGenerators: generator.subGenerators
					};
				});

				if (generators.length === 0) {
					reject();

					window.showInformationMessage('Make sure to install some generators first.', 'more info')
						.then(choice => {
							if (choice === 'more info') {
								opn('http://yeoman.io/learning/');
							}
						});

					return;
				}
				const sfMeshGenerators = generators.filter(generator => {
					return generator.label === azuresfmeshGenerator;
				});
				
				if (sfMeshGenerators.length === 0) {
					reject();

					window.showInformationMessage('Make sure to install Service Fabric Mesh generators first.', 'more info')
						.then(choice => {
							if (choice === 'more info') {
								opn('https://github.com/michaelfery/vscode-sf-mesh-tools#requirements');
							}
						});

					return;
				}
				resolve(sfMeshGenerators);
			});
		});
	});
}