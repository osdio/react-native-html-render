var htmlparser = require('./htmlparser2')


var blockTagArr = ['div', 'p', 'img', 'address',
    'blockquote', 'dir', 'dl', 'iframe',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'menu', 'ol', 'pre', 'table', 'ul', 'li', 'hr', 'tbody', 'tr', 'td', 'th']

var inlineTagArr = ['a', 'abbr', 'b', 'big',
    'br', 'cite', 'code', 'em', 'label', 'span', 'strong']


function indexOf(item, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (item == arr[i]) return true
    }
    return false
}

function pushText(parent, text) {
    if (!parent.children) parent.children = []
    parent.children.push({
        name: 'text',
        text: text,
        parent: parent,
        type: 'inline'
    });
}


var parseHtml = function (html, done) {
    //var startTime = new Date().getTime()


    var rootStack = [{
        name: 'div',
        type: 'block'
    }]
    var tagStack = [rootStack[0]]

    var opts = {
        recognizeSelfClosing: true,
        lowerCaseAttributeNames: true,
        lowerCaseTags: true,
        decodeEntities: true
    }

    var parser = new htmlparser.Parser({
        onopentag: function (name, attribs) {
            //console.log('openTag:');
            //console.log(name);

            var parent = tagStack[tagStack.length - 1]
            if (!parent.children) parent.children = []

            if (indexOf(name, blockTagArr) == 1) {
                parent.children.push({
                    name: name,
                    attribs: attribs,
                    type: 'block',
                    parent: parent
                })
                tagStack.push(parent.children[parent.children.length - 1])
            }
            else {
                var type = 'inline'
                if (parent.name == 'pre') type = 'block'


                parent.children.push({
                    name: name,
                    attribs: attribs,
                    type: type,
                    parent: parent
                })
                tagStack.push(parent.children[parent.children.length - 1])
            }
        },
        ontext: function (text) {
            if (text == '\n') return;
            var parent = tagStack[tagStack.length - 1];
            if (!parent.children) parent.children = [];

            parent.children.push({
                name: 'text',
                text: text,
                parent: parent,
                type: 'inline'
            })
        },
        onclosetag: function (name) {
            tagStack.pop()
        },
        onend: function () {
            done(rootStack[0].children)
            var endTime = new Date().getDate()
            //console.log(startTime - endTime);
        }
    }, opts)

    parser.write(html)
    parser.end()
}


module.exports = parseHtml



