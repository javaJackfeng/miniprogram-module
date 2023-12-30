import { WorkspaceFolder } from "vscode";
import * as fse from "fs-extra";
import { getConfig } from "./utils";
import { templateType, templateConfig } from "./config";
import defaultTemplates from "./defaultTemplates.json"

export default async function getTemplate(root: WorkspaceFolder | undefined, type: templateType) {
  const config = getConfig(root);
  const templatesFromConfig = (config.templates) as templateConfig

  if (!templatesFromConfig || !templatesFromConfig[type]) {
    return defaultTemplates[type]
  }
  return templatesFromConfig[type]
}