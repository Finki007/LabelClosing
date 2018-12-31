// mygenerator.js
var Parser = require("jison").Parser;

// a grammar in JSON
var grammar = {
  "lex": {
    "rules": [
      [
        "^(\\/\\*)([^\\n][\\s\\n]*)*(\\*\\/)$",
        `
          if (/*debug*/ false)
            console.log("multi_comment_open: ", yytext); 
          return 'MULTICOMMENTOPEN';
        `
      ],
      // [
      //   "\\*\\/",
      //   `
      //     if (yy.debug)
      //       console.log("multi_comment_close: ", yytext); 
      //     return 'MULTICOMMENTEND'; `
      // ],
      [
        "^(\\/\\/)[^\\n]+\\n$",
        `
          if (/*debug*/ false)          
            console.log("comment: ", yytext); 
          return 'COMMENT';
        `
      ],
      [
        "[^\\n\\]\\}]*[\\n\\s]*\\{",
        `
          if (/*debug*/ false)
            console.log("block_open: ", yytext); 
          return 'BLOCKOPEN';
        `
      ],
      [
        "[^\\n\\]\\}]*[\\n\\s]*\\[",
        `
          if (/*debug*/ false)
            console.log("square_bracket_open: ", yytext); 
          return 'SQUBRAOPEN';`
      ],
      [
        "\\}",
        `
          if (/*debug*/ false)
            console.log("block_end: ", yytext); 
          return 'BLOCKEND';`
      ],
      [
        "\\]",
        `
          if (/*debug*/ false)
            console.log("square_bracket_end: ", yytext); 
          return 'SQUBRAEND';`
      ],
      // [
      //   "([^\\[\\]\\{\\}\\r\\f\\n\\t])+",
      //   `
      //     if (/*debug*/ false)
      //       console.log("other_line: ", yytext); 
      //     return 'OTHER';
      //   `
      // ],
      [
        "[^\\n\\]\\}]*[\\s\\n\\r\\f]*",
        `
          if (/*debug*/ false)
            console.log("other_line: ", yytext); 
          return 'OTHER';
        `
      ],
      [
        "[\\n\\f\\r\\s]*", `/*return 'BR';*/`
      ]
    ]
  },

  "bnf": {
    "programm": [
      [
        "block",
        "ast = $1; console.log([$1]); return $1;"
      ]
    ],
    "block": [
      [
        "comment",
        []
      ],
      [
        "BLOCKOPEN block BLOCKEND block",
        `$$ = {"object": {
          type: 'block',
          content: $1,
          begin: {
            line: @1.first_line -1,
            column: @1.first_column,
          },
          inner: $2,
          end: {
            line: @3.first_line -1,
            column: @3.first_column,
          }
        }, "next": $4}; 
        //console.log("hey", @0, @1, @2, @3, @4);
        `
      ],
      //"BRACKETOPEN block bra",
      [
        "SQUBRAOPEN block SQUBRAEND block",
        `$$ = {"object": {
          type: 'squ',
          content: $1,
          begin: {
            line: @1.first_line -1,
            column: @1.first_column,
          },
          inner: $2,
          end: {
            line: @3.first_line -1,
            column: @3.first_column,
          }
        }, "next": $4};`
      ],
      [
        "OTHER block",
        `$$ = {"object": {
          type: 'other',
          content: $1
        }, "next": $2};`
      ],
      // "BR block",
      ["", "$$ = 'end'"]
    ],
    "comment": [
      [
        "COMMENT block",
        `$$ = {"object": {
          type: 'comment',
          text: $1
        }, "next": $2};`
      ],
      [
        // "MULTICOMMENTOPEN block MULTICOMMENTEND block",
        "MULTICOMMENTOPEN block",
        `$$ = {"object": {
          type: 'multi',
          start: $1,
          inner: $2
        }, "next": $4};`
      ]
    ]
  }
};

// `grammar` can also be a string that uses jison's grammar format
var parser = new Parser(grammar);

// you can also use the parser directly from memory

// returns true
export function parse(text: string = "") {
  if (text === "") {
    return parser.parse(`{
      //Hey
      object.function(para1, function (err, data) {
          if (err) {
              console.log(err);
          } else {
              console.log(data);
          }
          for (var i in array) {
  
          }
          json = {
              hey: "wie"
          }
          //comment
          how_are_you = {
  
          }
      });
      
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
  
      var myCredentials = (process.env.NODE_ENV === "development") ?
          new aws.SharedIniFileCredentials() : // Local environtment ~/.aws/credentials
          new aws.EnvironmentCredentials('aws'); // Lambda provided credentials
  }`);
  } else {
    var ast = parser.parse(text);
    
    function rec(node: any) {
      if (node["object"]){
        // console.log(node["object"]["type"] + ": " + node["object"]["content"]);
        if (node["object"]["inner"]){
          rec(node["object"]["inner"]);
        }
      }
      if (node["next"]){
        rec(node["next"]);
      }
    }
    rec(ast);
    return ast;
  }
}
