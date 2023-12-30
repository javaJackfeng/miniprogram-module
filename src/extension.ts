
import { Uri, ExtensionContext, commands, window, WorkspaceFolder } from 'vscode';
import path from 'path';
import {
  getCurrentRoot,
  getFolderPath
} from "./utils";
import Handlebars from 'handlebars';
import getTemplate from "./get-template";
import * as fse from "fs-extra";
import { templateType, FileTemplate, subPackage } from "./config";

const prompt = async (question: string, defaultValue?: string) => {
  const answer = await window.showInputBox({
    prompt: question,
    placeHolder: defaultValue,
  });
  return answer || defaultValue;
};

const render: (template: string, data: Record<string, any>)  => string = (template, data) => {
  const tem = Handlebars.compile(template);
  return tem(data);
};

async function updateJsonFile(filePath: string, pathArr: string[], name: string) {
  try {
    // Read the existing JSON file
    const existingData = await fse.readJSON(filePath);
    const existingDataCopy = JSON.parse(JSON.stringify(existingData));
    const subPackages = existingDataCopy.subPackages || [];
    const firstPath = pathArr[0];
    const isModule = subPackages.find((item: subPackage) => item.root === firstPath);
    const pagePath = (isModule ? pathArr.slice(1).join('/') : pathArr.join('/')) + `/${name}`;

    if (isModule) {
      const ObjSubPackages = existingDataCopy.subPackages;
      const subModuleItemIndex = ObjSubPackages.findIndex((item: subPackage) => item.root === firstPath);
      const subModuleItem = existingDataCopy.subPackages[subModuleItemIndex];
      existingDataCopy.subPackages[subModuleItemIndex].pages = subModuleItem.pages.concat([pagePath]);
    } else {
      existingDataCopy.pages = existingDataCopy.pages.concat([pagePath]);
    }

    const updatedJsonString = JSON.stringify(existingDataCopy, null, 2);
    await fse.writeFile(filePath, updatedJsonString);
  } catch (error) {
    window.showErrorMessage(`更新app.json出错, ${JSON.stringify(error)}`);
  }
}

function getAllDirectories(filePath: string) {
  const directories = [];
  let currentPath = filePath;

  // Loop until the root directory is reached
  while (currentPath !== path.dirname(currentPath)) {
    const directoryName = path.basename(currentPath);
    directories.unshift(directoryName); // Add to the beginning of the array

    currentPath = path.dirname(currentPath);
  }

  return directories;
}



async function newFromTemplate(uri: Uri | undefined, type: templateType) {
	const root = (await getCurrentRoot(uri)) as WorkspaceFolder;
	const template = await getTemplate(root, type);
	if (!template) {
		return;
	}
  const question = type === templateType.component ? '请输入组件名称' : ( type === templateType.page ) ?  '请输入页面名称' : '';
  if (!question) {
    return;
  }
  const name = await prompt(question);
  if (!name) {
    window.showErrorMessage(question || '请输入名称');
    return;
  }
  const folderName = render(template.folder, { name });
  const folderPath = getFolderPath(uri, root, folderName);
  const allDirectories = getAllDirectories(folderPath);
  const rootIndex = allDirectories.indexOf(root.name);
  const newPathArr = allDirectories.slice(rootIndex + 1);
  template.files.forEach(async (item: FileTemplate) => {
    const contentText = render(item.content.join('\n'), { name });
    const fileName = render(item.name, { name });
    const filePath = path.join(folderPath, fileName);
    await fse.outputFile(filePath, contentText);
  });
  const appJSONPath = path.join(root.uri.fsPath, 'app.json');
  if (type === templateType.page && fse.pathExistsSync(appJSONPath)) {
    updateJsonFile(appJSONPath, newPathArr, name as string);
  }
}


export function activate(context: ExtensionContext) {

	let disposableComponent = commands.registerCommand(
    'miniprogram-module.createWxMiniComponent',
    (uri: Uri | undefined) => {
      newFromTemplate(uri, templateType.component).catch(error => {
        window.showErrorMessage(error.message);
      });
    },
  );     

	context.subscriptions.push(disposableComponent);

  let disposablePage = commands.registerCommand(
    'miniprogram-module.createWxMiniPage',
    (uri: Uri | undefined) => {
      newFromTemplate(uri, templateType.page).catch(error => {
        window.showErrorMessage(error.message);
      });
    },
  );   

}


export function deactivate() {}
