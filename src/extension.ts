'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ts from 'typescript';

// import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  // console.log('decorator sample is activated');
  // var typeScriptLS =  new Harness.TypeScriptLS();

  // create a decorator type that we use to decorate small numbers
  const closingLabelDecorationType = vscode.window.createTextEditorDecorationType({});

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

    let sourceCode = activeEditor.document.getText();
    let sourceFile = ts.createSourceFile(activeEditor.document.fileName, sourceCode, ts.ScriptTarget.Latest, true, undefined);

    const closingLabel: vscode.DecorationOptions[] = [];

    let activeEditor2 = activeEditor;

    sourceFile.forEachChild(node => {
      recur(node);
    })

    function recur(node: ts.Node) {

      let kind = ts.SyntaxKind[node.kind];
      
      //node types/kinds which are supported
      let supportedElements = [
        "ArrayLiteralExpression",
        "Block",
        "ObjectLiteralExpression", 
        "JsxElement",
        "ParenthesizedExpression",
        "ClassDeclaration",
        "JsxAttribute"
      ];

      if (supportedElements.includes(kind)) {
        if (node.parent && ts.SyntaxKind[node.parent.kind].includes("JsxAttribute") && (activeEditor2.document.positionAt(node.end).line - activeEditor2.document.positionAt(node.pos).line) < 2)
          return;

        var endPos = activeEditor2.document.positionAt(node.end);
        var startPos = activeEditor2.document.positionAt(node.pos + (kind.includes("Jsx") ? 1 : 0));

        let textLine = startPos.line > 0 ? startPos.line : activeEditor2.document.positionAt(node.pos).line;

        var labelText = " // " + activeEditor2.document.lineAt(textLine).text.trim();

        if (startPos.line - 1 >= 0) {
          var matches = /\/\/(.*)/g.exec(activeEditor2.document.lineAt(startPos.line - 1).text);
          if (matches && matches.length > 0) {
            labelText = " // " + matches[1] + " - " + activeEditor2.document.lineAt(textLine).text.trim();
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
          hoverText += text + "\n";
        }

        hoverText += "\n```";

        const decorationEnd = {
          range: new vscode.Range(endPos, activeEditor2.document.lineAt(activeEditor2.document.positionAt(node.end).line).range.end),
          renderOptions: {
            dark: {
              after: {
                contentText: labelText,
                color: '#777',
                backgroundColor: '#aaaaaa00'
              }
            },
            light: {
              after: {
                contentText: labelText,
                color: '#cdcdcd',
                backgroundColor: '#aaaaaa00'
              }
            }
          },
          hoverMessage: new vscode.MarkdownString(hoverText)
        };
        closingLabel.push(decorationEnd);
      }

      node.forEachChild(nod => recur(nod))
    }

    activeEditor.setDecorations(closingLabelDecorationType, closingLabel);
  }
}
