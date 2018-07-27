'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const AbstractSyntaxTree = require('abstract-syntax-tree');

export function activate(context: vscode.ExtensionContext) {
  console.log('decorator sample is activated');

  // create a decorator type that we use to decorate small numbers
  const smallNumberDecorationType = vscode.window.createTextEditorDecorationType({});

  let activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    triggerUpdateDecorations();
  }

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

    const smallNumbers: vscode.DecorationOptions[] = [];

    const source = activeEditor.document.getText();
    let activeEditor2 = activeEditor;
    try {
      // JSXTree.getProp(
      const ast = new AbstractSyntaxTree(source);
      ast.walk((node: any, parent: any) => {
        node;
        if (node.type === "BlockStatement" || node.type === "ObjectExpression" || node.type === "ClassDeclaration") {
          var endPos = new vscode.Position(node.loc.end.line - 1, activeEditor2.document.lineAt(node.loc.end.line - 1).range.end.character);
          var startPos = new vscode.Position(node.loc.start.line - 1, activeEditor2.document.lineAt(node.loc.start.line - 1).range.start.character);
          var labelText = " // " + activeEditor2.document.lineAt(node.loc.start.line - 1).text;

          if (startPos.line - 1 >= 0) {
            var matches = /\/\/(.*)/g.exec(activeEditor2.document.lineAt(startPos.line - 1).text);
            if (matches && matches.length > 0) {
              labelText = " // " + matches[1] + " - " + activeEditor2.document.lineAt(node.loc.start.line - 1).text.trim();
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
              if (ma && ma.length > 0)
                offset = ma[0].length;
            }
            text = text.substring(offset);
            hoverText += text + "\n   ";
          }

          hoverText += "\n```";

          const decorationEnd = {
            range: new vscode.Range(endPos, activeEditor2.document.lineAt(node.loc.end.line - 1).range.end),
            renderOptions: {
              dark: {
                after: {
                  contentText: labelText,
                  color: '#777',
                  backgroundColor: '#aaaaaa60'
                }
              },
              light: {
                after: {
                  contentText: labelText,
                  color: '#cdcdcd',
                  backgroundColor: '#00000000'
                }
              }
            },
            hoverMessage: new vscode.MarkdownString(hoverText)
          };
          smallNumbers.push(decorationEnd);
        }
      })
    } catch (error) {
    }

    activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
    // activeEditor.setDecorations(largeNumberDecorationType, largeNumbers);
  }
}
