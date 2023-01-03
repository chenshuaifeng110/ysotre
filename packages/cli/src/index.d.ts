
export interface VersionInfo {
  newVersion: string|undefined;
  lastVersion: string|undefined;
  updataTime: number;
  localVersion: string;
  
  [key: string]: any
}

export interface CLI {
  [key: string]: string | number;
}

