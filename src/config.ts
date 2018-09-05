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
		this.config = workspace.getConfiguration("labelClosing");
	}

  private getConfig<T>(key: string): T | undefined {
		return this.config.get(key);
	}
  
	get enableJSX(): boolean | undefined { 
		return this.getConfig("enableJSX"); 
	}
  
	get showToolTip(): boolean | undefined { 
		return this.getConfig("showToolTip"); 
	}
  
	get showToolTipMin(): number | undefined { 
		return this.getConfig("showToolTipMin"); 
	}
  
	get showToolTipLines(): number | undefined { 
		return this.getConfig("showToolTipLines"); 
	}
  
	get amountOfLines(): number | undefined { 
		return this.getConfig("amountOfLines"); 
	}
  
	get seperatorChar(): string | undefined { 
		return this.getConfig("seperatorChar"); 
	}
  
	get lightFontColor(): string | undefined { 
		return this.getConfig("lightFontColor"); 
	}
  
	get lightBackgroundColor(): string | undefined { 
		return this.getConfig("lightBackgroundColor"); 
	}
  
	get darkFontColor(): string | undefined { 
		return this.getConfig("darkFontColor"); 
	}
  
	get darkBackgroundColor(): string | undefined { 
		return this.getConfig("darkBackgroundColor"); 
	}
}

export const config = new Config();
