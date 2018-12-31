{
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

    /*
    ssadadsds
    asdasdasd
    */
    
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
}