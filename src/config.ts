export type FileTemplate = {
    name: string;
    content: string[];
  };
  
  
  export interface Template {
    files: FileTemplate[];
    folder: string
  }
  
  
  export enum templateType {
    component = 'component',
    page = 'page'
  }
  
  export type templateConfig = {
    [str in templateType]: Template;
  };
  
  export type subPackage = {
    root: string,
    page: string[]
  }