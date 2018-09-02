'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ts from 'typescript';
import { config } from './config';

// import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  console.log('decorator sample is activated');

  // create a decorator type that we use to decorate small numbers
  const closingLabelDecorationType = vscode.window.createTextEditorDecorationType({});

  //Settings
  const defaultSettings = {
    enableJSX: true,
    showToolTip: true,
    amountOfLines: 1,
    seperatorChar: " // ",
    lightFontColor: "#",
    lightBackgroundColor: "#aaaaaa00",
    darkFontColor: "#777",
    darkBackgroundColor: "#aaaaaa00",
  };

  var enableJSX: boolean = config.enableJSX ? true : defaultSettings.enableJSX;
  var showToolTip: boolean = config.showToolTip ? true : defaultSettings.showToolTip;
  var amountOfLines: number = config.amountOfLines ? config.amountOfLines : defaultSettings.amountOfLines;
  var seperatorChar: string = config.seperatorChar ? config.seperatorChar : defaultSettings.seperatorChar;
  var lightFontColor: string = config.lightFontColor ? config.lightFontColor : defaultSettings.lightFontColor;
  var lightBackgroundColor: string = config.lightBackgroundColor ? config.lightBackgroundColor : defaultSettings.lightBackgroundColor;
  var darkFontColor: string = config.darkFontColor ? config.darkFontColor : defaultSettings.darkFontColor;
  var darkBackgroundColor: string = config.darkBackgroundColor ? config.darkBackgroundColor : defaultSettings.darkBackgroundColor;

  let activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    triggerUpdateDecorations();
  }

  vscode.workspace.onDidChangeConfiguration(event => {
    let isChanged = (key: string) =>
      event.affectsConfiguration(key);

    if (isChanged("labelClosing.enableJSX")) {
      enableJSX = config.enableJSX ? true : defaultSettings.enableJSX;
    }
    if (isChanged("labelClosing.amountOfLines")) {
      amountOfLines = config.amountOfLines ? config.amountOfLines : defaultSettings.amountOfLines;
    }
    if (isChanged("labelClosing.showToolTip")) {
      showToolTip = config.showToolTip ? config.showToolTip : defaultSettings.showToolTip;
    }
    if (isChanged("labelClosing.seperatorChar")) {
      seperatorChar = config.seperatorChar ? config.seperatorChar : defaultSettings.seperatorChar;
    }
    if (isChanged("labelClosing.lightFontColor")) {
      lightFontColor = config.lightFontColor ? config.lightFontColor : defaultSettings.lightFontColor;
    }
    if (isChanged("labelClosing.lightBackgroundColor")) {
      lightBackgroundColor = config.lightBackgroundColor ? config.lightBackgroundColor : defaultSettings.lightBackgroundColor;
    }
    if (isChanged("labelClosing.darkFontColor")) {
      darkFontColor = config.darkFontColor ? config.darkFontColor : defaultSettings.darkFontColor;
    }
    if (isChanged("labelClosing.darkBackgroundColor")) {
      darkBackgroundColor = config.darkBackgroundColor ? config.darkBackgroundColor : defaultSettings.darkBackgroundColor;
    }
  });

  vscode.window.onDidChangeActiveTextEditor(editor => {
    activeEditor = editor;
    if (editor) {
      triggerUpdateDecorations();
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument(event => {
    if (activeEditor && event.document === activeEditor.document) {
      triggerUpdateDecorations();
    }
  }, null, context.subscriptions);

  var timeout: any = null;
  function triggerUpdateDecorations() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(updateDecorations, 500);
  }

  function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    let sourceCode = activeEditor.document.getText();
    let sourceFile = ts.createSourceFile(activeEditor.document.fileName, sourceCode, ts.ScriptTarget.Latest, true, undefined);

    const closingLabel: vscode.DecorationOptions[] = [];

    let activeEditor2 = activeEditor;

    sourceFile.forEachChild(node => {
      recur(node);
    });

    function recur(node: ts.Node) {
      let kind = ts.SyntaxKind[node.kind];

      //node types/kinds which are supported
      let supportedElements = [
        "ArrayLiteralExpression",
        "Block",
        "ObjectLiteralExpression",
        "ParenthesizedExpression",
        "ClassDeclaration"
      ];

      if (enableJSX) {
        supportedElements.push(
          "JsxAttribute"
          // "JsxElement"
        );
      }

      if (supportedElements.includes(kind)) {
        var specialStart: number = -1;

        if (node.hasOwnProperty("name")) {
          var namedDec: any = (node as ts.NamedDeclaration);
          specialStart = node.pos === (namedDec.name).pos ? (namedDec.name).end : (namedDec.name).pos;
        }
        if (node.hasOwnProperty("openingElement")) {
          var jsx: any = (node as ts.JsxElement);
          specialStart = (jsx.openingElement.attributes).pos;
        }

        var endPos = activeEditor2.document.positionAt(node.end);
        var startPos =
          specialStart !== -1 ?
          activeEditor2.document.positionAt(specialStart) :
            activeEditor2.document.positionAt(node.pos);

        if (endPos.line - startPos.line < amountOfLines) {
          return;
        }

        let textLine = startPos.line;

        var labelText = seperatorChar + activeEditor2.document.lineAt(textLine).text.trim();

        if (startPos.line - 1 >= 0) {
          var matches = /\/\/(.*)/g.exec(activeEditor2.document.lineAt(startPos.line - 1).text);
          if (matches && matches.length > 0) {
            labelText = seperatorChar + matches[1] + " - " + activeEditor2.document.lineAt(textLine).text.trim();
          }
        }

        let hoverText = "```js\n";
        let offset = 0;

        for (let item = startPos.line;
          item < activeEditor2.document.lineCount && item < startPos.line + 4 && item <= endPos.line;
          item++
        ) {
          let text = activeEditor2.document.lineAt(item).text;
          if (item === startPos.line) {
            const reg = /^\s\s+/g;
            let ma = reg.exec(text);
            if (ma && ma.length > 0) {
              offset = ma[0].length;
            }
          }
          text = text.substring(offset);
          hoverText += text + "\n";
        }

        hoverText += "\n```";

        const decorationEnd = {
          range: new vscode.Range(endPos, activeEditor2.document.lineAt(activeEditor2.document.positionAt(node.end).line).range.end),
          renderOptions: {
            dark: {
              after: {
                contentText: labelText,
                color: darkFontColor,
                backgroundColor: darkBackgroundColor
              }
            },
            light: {
              after: {
                contentText: labelText,
                color: lightFontColor,
                backgroundColor: lightBackgroundColor
              }
            }
          },
          hoverMessage: showToolTip ? new vscode.MarkdownString(hoverText) : ""
        };
        closingLabel.push(decorationEnd);
      }

      node.forEachChild(nod => recur(nod));
    }

    activeEditor.setDecorations(closingLabelDecorationType, closingLabel);
  }
}
