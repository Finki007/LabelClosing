import {  
  workspace, 
  WorkspaceConfiguration 
} from "vscode";

class Config {
	private config: WorkspaceConfiguration = workspace.getConfiguration('labelClosing');

  //Settings
  private defaultSettings = {
		enableJSX: true,
		onlyCommentLabel: false,
    showToolTip: true,
    showToolTipMin: 4,
    showToolTipLines: 4,
    amountOfLines: 1,
    seperatorChar: " // ",
    lightFontColor: "#",
    lightBackgroundColor: "#aaaaaa00",
    darkFontColor: "#777",
    darkBackgroundColor: "#aaaaaa00",
  };

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
  
	get enableJSX(): boolean { 
		const enableJSX = this.getConfig("enableJSX"); 
		return enableJSX !== undefined ?  Boolean(enableJSX) : this.defaultSettings.enableJSX;
	}
  
	get showToolTip(): boolean { 
		const showToolTip = this.getConfig("showToolTip"); 
		return showToolTip !== undefined ? Boolean(showToolTip) : this.defaultSettings.showToolTip;
	}
  
	get onlyCommentLabel(): boolean { 
		const onlyCommentLabel = this.getConfig("onlyCommentLabel"); 
		return onlyCommentLabel !== undefined ? Boolean(onlyCommentLabel) : this.defaultSettings.onlyCommentLabel;
	}
  
	get showToolTipMin(): number {
		const showToolTipMin = this.getConfig("showToolTipMin"); 
		return showToolTipMin ? Number(showToolTipMin) : this.defaultSettings.showToolTipMin;
	}
  
	get showToolTipLines(): number { 
		const showToolTipLines = this.getConfig("showToolTipLines"); 
		return showToolTipLines ? Number(showToolTipLines) : this.defaultSettings.showToolTipLines;
	}
  
	get amountOfLines(): number { 
		const amountOfLines = this.getConfig("amountOfLines"); 
		return amountOfLines ? Number(amountOfLines) : this.defaultSettings.amountOfLines;
	}
  
	get seperatorChar(): string { 
		const seperatorChar = this.getConfig("seperatorChar"); 
		return seperatorChar ? String(seperatorChar) : this.defaultSettings.seperatorChar;
	}
  
	get lightFontColor(): string { 
		const lightFontColor = this.getConfig("lightFontColor"); 
		return lightFontColor ? String(lightFontColor) : this.defaultSettings.lightFontColor;
	}
  
	get lightBackgroundColor(): string { 
		const lightBackgroundColor = this.getConfig("lightBackgroundColor"); 
		return lightBackgroundColor ? String(lightBackgroundColor) : this.defaultSettings.lightBackgroundColor;
	}
  
	get darkFontColor(): string { 
		const darkFontColor = this.getConfig("darkFontColor"); 
		return darkFontColor ? String(darkFontColor) : this.defaultSettings.darkFontColor;
	}
  
	get darkBackgroundColor(): string { 
		const darkBackgroundColor = this.getConfig("darkBackgroundColor"); 
		return darkBackgroundColor ? String(darkBackgroundColor) : this.defaultSettings.darkBackgroundColor;
	}
}

export const config = new Config();
