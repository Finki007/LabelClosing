{
    //Hallo
    let s3 = null;
    //hey
    let params = {

    };
    s3.upload(params, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("File uploaded to s3 Bucket"); 
        }
        let json = {
            Hallo: "wie"
        }
        //object for knowing how are you
        let how_are_you = {

        }
    });
}