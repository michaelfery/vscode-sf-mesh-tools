import { window, workspace } from 'vscode';

export async function getWorkingFolder(): Promise<string> {
	if (!Array.isArray(workspace.workspaceFolders) || workspace.workspaceFolders.length === 0) {
		return undefined;
	}

	if (workspace.workspaceFolders.length === 1) {
		return workspace.workspaceFolders[0].uri.fsPath;
	}
	const selectedWkFolder = (window as any).showWorkspaceFolderPick();
	return selectedWkFolder ? selectedWkFolder.uri.fspath : undefined;
}