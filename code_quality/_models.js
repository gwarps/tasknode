var LintStream = require('jslint').LintStream
   ,fs = require('fs');
l = new LintStream();

var path = "../models/"

/*
fs.readdir(path, function(err, files) {
   files.forEach(function(file_name){
         l.write({body: path + file_name});
         l.on('data', function (chunk, encoding, callback) {
            //console.log(typeof chunk.linted);
            //console.log(chunk.linted.ok);
            console.log("===================");
            console.log(chunk.linted.tokens);
         });
   });
});

*/
