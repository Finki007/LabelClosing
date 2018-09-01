import {  
  workspace, 
  WorkspaceConfiguration 
} from "vscode";

class Config {
	private config: WorkspaceConfiguration = workspace.getConfiguration('labelClosing');

	constructor() {
		workspace.onDidChangeConfiguration((e) => this.loadConfig());
		this.loadConfig();
	}

	private loadConfig() {
		this.config = workspace.getConfiguration("dart");
	}

  private getConfig<T>(key: string): T | undefined {
		return this.config.get<T>(key);
	}
  
	get enableJSX(): boolean | undefined { 
		return this.getConfig<boolean>("enableJSX"); 
	}
  
	get amountOfLines(): number | undefined { 
		return this.getConfig<number>("amountOfLines"); 
	}
}

export const config = new Config();
