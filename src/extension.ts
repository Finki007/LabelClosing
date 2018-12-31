'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ts from 'typescript';
import { config } from './config';
import { parse } from './compile';

// import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  console.log('decorator sample is activated');

  // create a decorator type that we use to decorate small numbers
  const closingLabelDecorationType = vscode.window.createTextEditorDecorationType({});

  var enableJSX: boolean = config.enableJSX;
  var onlyCommentLabel: boolean = config.onlyCommentLabel;
  var showToolTip: boolean = config.showToolTip;
  var showToolTipMin: number = config.showToolTipMin;
  var showToolTipLines: number = config.showToolTipLines;
  var amountOfLines: number = config.amountOfLines;
  var seperatorChar: string = config.seperatorChar;
  var lightFontColor: string = config.lightFontColor;
  var lightBackgroundColor: string = config.lightBackgroundColor;
  var darkFontColor: string = config.darkFontColor;
  var darkBackgroundColor: string = config.darkBackgroundColor;

  let activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    triggerUpdateDecorations();
  }

  //onChange Setting
  vscode.workspace.onDidChangeConfiguration(event => {
    let isChanged = (key: string) =>
      event.affectsConfiguration(key);

    if (isChanged("labelClosing.enableJSX")) {
      enableJSX = config.onlyCommentLabel;
    }
    if (isChanged("labelClosing.onlyCommentLabel")) {
      onlyCommentLabel = config.onlyCommentLabel;
    }
    if (isChanged("labelClosing.amountOfLines")) {
      amountOfLines = config.amountOfLines;
    }
    if (isChanged("labelClosing.showToolTip")) {
      showToolTip = config.showToolTip;
    }
    if (isChanged("labelClosing.showToolTipMin")) {
      showToolTipMin = config.showToolTipMin;
    }
    if (isChanged("labelClosing.showToolTipLines")) {
      showToolTipLines = config.showToolTipLines;
    }
    if (isChanged("labelClosing.seperatorChar")) {
      seperatorChar = config.seperatorChar;
    }
    if (isChanged("labelClosing.lightFontColor")) {
      lightFontColor = config.lightFontColor;
    }
    if (isChanged("labelClosing.lightBackgroundColor")) {
      lightBackgroundColor = config.lightBackgroundColor;
    }
    if (isChanged("labelClosing.darkFontColor")) {
      darkFontColor = config.darkFontColor;
    }
    if (isChanged("labelClosing.darkBackgroundColor")) {
      darkBackgroundColor = config.darkBackgroundColor;
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

    var languages = ["javascript", "typescript", "jsx"];
    var language = activeEditor.document.languageId;

    const closingLabel: vscode.DecorationOptions[] = [];

    let activeEditor2 = activeEditor;

    if (!languages.includes(language)) {
      var ast = parse(sourceCode);
      function rec(node: any) {
        if (node["object"]) {
          //console.log(node, node["object"]["type"] + ": " + node["object"]["content"]);
          if (["block", "squ"].includes(node["object"]["type"])) {
            {
              var nodeObject = node["object"];
              var nodeEnd = nodeObject["end"];
              var nodeBegin = nodeObject["begin"];
              var endPos = new vscode.Position(nodeEnd["line"], nodeEnd["column"]);
              var startPos = new vscode.Position(nodeBegin["line"], nodeBegin["column"]);
              var labelText = nodeObject["content"];

              var lines = endPos.line - startPos.line;
              let hoverText = "```js\n";
              let offset = 0;

              if (lines < amountOfLines) {
                return;
              }

              if (lines >= showToolTipMin) {
                for (let item = startPos.line;
                  item < activeEditor2.document.lineCount && item < startPos.line + showToolTipLines && item <= endPos.line;
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
              }
              hoverText += "\n```";

              const decorationEnd = {
                range: new vscode.Range(endPos, activeEditor2.document.lineAt(nodeEnd.line).range.end),
                renderOptions: {
                  dark: {
                    after: {
                      contentText: " " + seperatorChar + labelText,
                      color: darkFontColor,
                      backgroundColor: darkBackgroundColor
                    }
                  },
                  light: {
                    after: {
                      contentText: " " + seperatorChar + labelText,
                      color: lightFontColor,
                      backgroundColor: lightBackgroundColor
                    }
                  }
                },
                hoverMessage: showToolTip && lines >= showToolTipMin ? new vscode.MarkdownString(hoverText) : ""
              };
              closingLabel.push(decorationEnd);
            }
          }
          if (node["object"]["inner"]) {
            rec(node["object"]["inner"]);
          }
        }
        if (node["next"]) {
          rec(node["next"]);
        }
      }
      rec(ast);
    } else {
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
            "JsxAttribute",
            "JsxElement"
          );
        }

        if (supportedElements.includes(kind)) {
          var specialStart: number = -1;
          let specialText: string = "";
          let useSpecialText: boolean = false;
          let useCommentText: boolean = false;

          if (node.hasOwnProperty("name")) {
            var namedDec: any = (node as ts.NamedDeclaration);
            specialStart = node.pos === (namedDec.name).pos ? (namedDec.name).end : (namedDec.name).pos;
          }
          if (enableJSX && node.hasOwnProperty("openingElement")) {
            var jsx: any = (node as ts.JsxElement);
            specialStart = (jsx.openingElement.attributes).pos;
            var tagName = "<" + (jsx.openingElement.tagName).text;
            var attributesText = "";
            for (var props of (jsx.openingElement.attributes).properties) {
              var named: any = (props as ts.NamedDeclaration);
              attributesText += (attributesText === "" ? " " : ", ") + (named.name).text + "=[...]";
            }
            specialText = tagName + attributesText + ">";
            useSpecialText = true;
          }

          var endPos = activeEditor2.document.positionAt(node.end);
          var startPos =
            specialStart !== -1 ?
              activeEditor2.document.positionAt(specialStart) :
              activeEditor2.document.positionAt(node.pos);
          var lines = endPos.line - startPos.line;

          if (lines < amountOfLines) {
            return;
          }

          let textLine = startPos.line;
          let text = useSpecialText ? specialText : activeEditor2.document.lineAt(textLine).text.trim();

          var commentText = seperatorChar + text;

          if (startPos.line - 1 >= 0) {
            var matches = /\/\/(.*)/g.exec(activeEditor2.document.lineAt(startPos.line - 1).text);
            if (matches && matches.length > 0) {
              commentText = seperatorChar + matches[1] + (!onlyCommentLabel ? " - " + text : "");
              useCommentText = true;
            }
          } else {
            var matches = /\/\/(.*)/g.exec(activeEditor2.document.lineAt(startPos.line).text);
            if (matches && matches.length > 0) {
              commentText = seperatorChar + matches[1] + (!onlyCommentLabel ? " - " + text : "");
              useCommentText = true;
            }
          }

          var labelText = onlyCommentLabel ?
            (useCommentText ? commentText : "") :
            commentText;

          let hoverText = "```js\n";
          let offset = 0;

          if (lines >= showToolTipMin) {
            for (let item = startPos.line;
              item < activeEditor2.document.lineCount && item < startPos.line + showToolTipLines && item <= endPos.line;
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
            hoverMessage: showToolTip && lines >= showToolTipMin ? new vscode.MarkdownString(hoverText) : ""
          };
          closingLabel.push(decorationEnd);
        }



        node.forEachChild(nod => recur(nod));
      }
    }

    activeEditor.setDecorations(closingLabelDecorationType, closingLabel);
  }
}
