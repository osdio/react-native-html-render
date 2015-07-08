var htmlparser = require('./lib/htmlparser2')
var fs = require('fs')
var htmlParse = require('./lib/htmlParse')


var data = fs.readFileSync('./example/test.html', {
    encoding: 'utf-8'
})

console.log(data);

var opts = {
    recognizeSelfClosing: true,
    lowerCaseAttributeNames: true,
    lowerCaseTags: true,
    decodeEntities: true
}

//var parser = new htmlparser.Parser({
//    onopentag: function (name) {
//        console.log('openTag:');
//        console.log(name);
//    },
//
//    ontext: function (text) {
//        console.log('text:');
//        console.log(text);
//    },
//
//    onclosetag: function (name) {
//        console.log('closeTag:');
//        console.log(name);
//    },
//
//    onend: function () {
//        console.log('end');
//    }
//}, opts)
//
//parser.write(data)
//parser.end()

var startTime = new Date().getTime()
htmlParse(data, function (data) {
    var endTime = new Date().getTime()
    var usedTime = endTime - startTime
    console.log(usedTime + 'ms');
})


