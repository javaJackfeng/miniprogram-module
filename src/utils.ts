import { Uri, window, workspace, WorkspaceFolder } from "vscode";
import * as path from "path";

const TEMPLATE_KEY = 'miniprogram-templates'

export function showModal(message: string) {
  window.showInformationMessage(message, { modal: true });
}

export async function getCurrentRoot(uri: Uri | undefined): Promise<WorkspaceFolder | undefined> {
  const workspaceFolder = uri
    ? workspace.getWorkspaceFolder(uri)
    : undefined;

  if (workspaceFolder) return workspaceFolder;
}

export function getConfig(root: WorkspaceFolder | undefined) {
  return workspace.getConfiguration(TEMPLATE_KEY, root) as any;
}


export function getFolderPath(
  uri: Uri | undefined,
  root: WorkspaceFolder,
  folderName: string | undefined,
) {
  if (uri) return folderName ? path.join(uri.fsPath, folderName) : uri.fsPath;
  const rootToUse = root.uri.fsPath;
  return folderName ? path.join(rootToUse, folderName) : rootToUse;
}