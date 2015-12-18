# react-native-html-render
> A html render for react-native. But don't **Suitable for** all html. Only **Suitable for** the html generator by markdown with minify.
> 
> Now it used by [Noder](https://github.com/soliury/noder-react-native).
>
> Be careful to use, the performance is not good. If you want to improve the performance, be free to open a issue or send a PR. 


## Install

```
npm install react-native-html-render
```

## Futures

* Support img and code render. 
* Can set custom render function and styles.
* More beautiful native View.

## Demo

![noder-demo](http://7lrzfj.com1.z0.glb.clouddn.com/soliurynoder-html-render.gif)

## Example

```
var React = require('react-native')

var HtmlRender = require('react-native-html-render')

var window = require('../../util/window')
var routes = require('../../configs/routes')


var { width, height } = window.get()

var {
    Component,
    View,
    Text,
    StyleSheet,
    Image,
    LinkingIOS,
    Navigator
    }=React

var contentFontSize = 16


var styles = StyleSheet.create({
    img: {
        width: width - 30,
        height: width - 30,
        resizeMode: Image.resizeMode.contain
    }
})


class HtmlContent extends Component {
    constructor(props) {
        super(props)
    }


    _onLinkPress(url) {
        if (/^\/user\/\w*/.test(url)) {
            let authorName = url.replace(/^\/user\//, '')
            routes.toUser(this, {
                userName: authorName
            })
        }

        if (/^https?:\/\/.*/.test(url)) {
            window.link(url)
        }
    }


    _renderNode(node, index, parent, type) {
        var name = node.name
        if (node.type == 'block' && type == 'block') {
            if (name == 'img') {
                var uri = node.attribs.src;
                if (/^\/\/dn-cnode\.qbox\.me\/.*/.test(uri)) {
                    uri = 'https:' + uri
                }
                return (
                    <View
                        key={index}
                        style={styles.imgWrapper}>
                        <Image source={{uri:uri}}
                               style={styles.img}>
                        </Image>
                    </View>
                )
            }
        }
    }


    render() {
        return (
            <HtmlRender
                value={this.props.content}
                stylesheet={this.props.style}
                onLinkPress={this._onLinkPress.bind(this)}
                renderNode={this._renderNode}
                />
        )
    }

}

module.exports = HtmlContent
```

## API

### `value`

The value of html content.

### `stylesheet`

Custom styles

### `onLinkPress`

Handle the link click event.

### `renderNode`

Custom render function.

The render function has three arguments.

**node**: A Object show the node of html.

Struct:

```
{
    name:'text',
    text: String,
    parent: Object,
    type: String
}

or If the node is not a text node:

{
    name: String,
    attribs: Object,
    type: String,
    parent: Object
}

```

**index**: The index of the node in the parent node.

**parent**: The parent of the node.

**type**: Only two types: `block` or `inline`.

Mor details:

```

var blockTagArr = ['div', 'p', 'img', 'address',
    'blockquote', 'dir', 'dl',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'menu', 'ol', 'pre', 'table', 'ul', 'li', 'hr']

var inlineTagArr = ['a', 'abbr', 'b', 'big',
    'br', 'cite', 'code', 'em', 'label', 'span', 'strong']
    
```

## FAQ

More details see [Noder](https://github.com/soliury/noder-react-native).

## Licenses

[MIT](https://opensource.org/licenses/MIT)




