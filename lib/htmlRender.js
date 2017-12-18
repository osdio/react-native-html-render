import React from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View,
    Component,
    Image,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    LinkingIOS,
    Dimensions
} from 'react-native';

import htmlParse from './htmlParse';

const BULLET = '  \u2022  ';
const LINE_BREAK = '\n';
const {height, width} = Dimensions.get('window');


function rendCodeBlock(codeText, styles) {
    let codeLines = codeText.split('\n');
    return codeLines.map(function (line, index, arr) {
        let lineNum = index + 1;
        if (line == '')
            line = '\n';
        if (index == codeLines.length - 1)
            return null;
        return (
            <View key={'codeRow' + index} style={styles.codeRow}>
                <View style={styles.lineNumWrapper}>
                    <Text style={styles.lineNum}>
                        {lineNum + '.'}
                    </Text>
                </View>

                <View style={styles.codeLineWrapper}>
                    <Text style={styles.codeLine}>
                        {line}
                    </Text>
                </View>
            </View>
        );
    });
}

function getCodeRowStyle(num, length, styles) {
    if (num == 1 && length == num) {
        return [styles.codeRow, styles.codeFirstAndLastRow];
    }

    if (num == 1) {
        return [styles.codeRow, styles.codeFirstRow];
    }
    if (num == length) {
        return [styles.codeRow, styles.codeLastRow];
    }

    return styles.codeRow;
}


const htmlToElement = function (rawHtml, opts, done) {
    let styles = opts.styles;

    function domToElement(dom, parent, type) {
        if (!dom)
            return null;

        return dom.map((node, index, list) => {
            if (opts.customRenderer) {
                let rendered = opts.customRenderer(node, index, parent, type);
                if (rendered || rendered === null)
                    return rendered;
            }

            //console.log(node.name);
            //console.log(node.type);
            //console.log(node.attribs);

            let name = node.name;


            if (name == 'text' && type == 'inline') {
                // ignore carriage return
                if (node.text.charCodeAt() === 13)
                    return;
                return (
                    <Text key={index} style={styles[parent.name]}>
                        {node.text}
                    </Text>
                )
            }

            if (node.type == 'inline' && type == 'block')
                return null;

            if (node.type == 'inline') {
                let uri = node.attribs.href;
                if (name == 'a') {
                    return (
                        <Text
                            onPress={opts.linkHandler.bind(this,uri)}
                            key={index} style={styles[name]}>
                            {domToElement(node.children, node, 'inline')}
                        </Text>
                    )
                }

                return (
                    <Text key={index} style={styles[name]}>
                        {domToElement(node.children, node, 'inline') }
                        {node.name == 'br' ? LINE_BREAK : null}
                    </Text>
                );
            }

            if (node.type == 'block' && type == 'block') {
                if (name == 'img') {
                    let uri = node.attribs.src;
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


                if (name == 'code') {
                    let codeText = '';

                    node.children.forEach(function (code) {
                        codeText = codeText + code.text;
                    });
                    return (
                        <ScrollView
                            style={styles.codeScrollView}
                            horizontal={true}>
                            <View style={styles.codeWrapper}>
                                {rendCodeBlock(codeText, styles) }
                            </View>
                        </ScrollView>
                    );
                }


                return (
                    <View key={index} style={styles[name + 'wrapper']}>
                        <Text>
                            {node.name == 'li' ? BULLET : null}
                            {domToElement(node.children, node, 'inline') }
                        </Text>
                        <View style={styles[name + 'InnerWrapper']}>
                            {domToElement(node.children, node, 'block') }
                        </View>
                    </View>
                );
            }
        })

    }

    htmlParse(rawHtml, function (dom) {
        done(null, domToElement(dom, null, 'block'));
    })
}


export default class HtmlView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            element: null
        }
    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.startHtmlRender();
    }

    componentDidMount() {
        this.startHtmlRender();
    }

    startHtmlRender() {
        if (!this.props.value)
            return;
        if (this.renderingHtml)
            return;

        let opts = {
            linkHandler: this.props.onLinkPress,
            styles: Object.assign({}, baseStyles, this.props.stylesheet),
            customRenderer: this.props.renderNode
        };

        this.renderingHtml = true;
        htmlToElement(this.props.value, opts, (err, element) => {
            this.renderingHtml = false;

            if (err)
                return (this.props.onError || console.error)(err);
            this.setState({
                element: element
            });
        });
    }

    render() {
        if (this.state.element) {
            return (<View children={this.state.element} style={{ flex: 1 }}/>);
        }
        return (<View />);
    }
}

HtmlView.propTypes = {
    value: PropTypes.string,
    stylesheet: PropTypes.object,
    onLinkPress: PropTypes.func,
    renderNode: PropTypes.func
}

const fontSize = 16;
const titleMargin = 15;
const liFontSize = fontSize - 2;

const baseStyles = StyleSheet.create({
    img: {
        width: width - 30,
        height: width - 30,
        resizeMode: Image.resizeMode.contain
    },
    //imgWrapper: {
    //    width: width - 30,
    //    height: height,
    //    flexDirection: 'row'
    //},
    p: {
        lineHeight: fontSize * 1.5,
        fontSize: fontSize,
        //marginTop: 15,
        //marginBottom: 15,
        paddingTop: 5,
        paddingBottom: 5,
        color: 'rgba(0,0,0,0.8)'
    },
    pwrapper: {
        marginTop: 15,
        marginBottom: 15
    },

    a: {
        color: '#3498DB',
        fontSize: fontSize,
        paddingLeft: 4,
        paddingRight: 4,
        marginRight: 10,
        marginLeft: 10,
        fontFamily: 'Courier'

    },
    h1: {
        fontSize: fontSize * 1.6,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.8)'
    },
    h1wrapper: {
        marginTop: titleMargin,
        marginBottom: titleMargin
    },
    h2: {
        fontSize: fontSize * 1.5,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.85)'
    },
    h2wrapper: {
        marginBottom: titleMargin,
        marginTop: titleMargin
    },
    h3: {
        fontWeight: 'bold',
        fontSize: fontSize * 1.4,
        color: 'rgba(0,0,0,0.8)'
    },
    h3wrapper: {
        marginBottom: titleMargin - 2,
        marginTop: titleMargin - 2
    },
    h4: {
        fontSize: fontSize * 1.3,
        color: 'rgba(0,0,0,0.7)',
        fontWeight: 'bold'
    },
    h4wrapper: {
        marginBottom: titleMargin - 2,
        marginTop: titleMargin - 2,
    },
    h5: {
        fontSize: fontSize * 1.2,
        color: 'rgba(0,0,0,0.7)',
        fontWeight: 'bold'
    },
    h5wrapper: {
        marginBottom: titleMargin - 3,
        marginTop: titleMargin - 3,
    },
    h6: {
        fontSize: fontSize * 1.1,
        color: 'rgba(0,0,0,0.7)',
        fontWeight: 'bold'
    },
    h6wrapper: {
        marginBottom: titleMargin - 3,
        marginTop: titleMargin - 3,
    },
    li: {
        fontSize: fontSize * 0.9,
        color: 'rgba(0,0,0,0.7)'
    },
    liwrapper: {
        paddingLeft: 20,
        marginBottom: 10
    },
    strong: {
        fontWeight: 'bold'
    },
    em: {
        fontStyle: 'italic'
    },
    code: {
        color: '#E74C3C',
        paddingLeft: 5,
        paddingRight: 5,
        fontFamily: 'Courier'

    },
    codeScrollView: {
        //paddingBottom: 15,
        //paddingRight: 15,
        //paddingLeft: 15,
        //paddingTop: 15,
        backgroundColor: '#333',
        flexDirection: 'column',
        marginBottom: 15
    },
    codeRow: {
        flex: 1,
        flexDirection: 'row',
        height: 25,
        alignItems: 'center'
    },
    codeFirstRow: {
        paddingTop: 20,
        height: 25 + 20
    },
    codeLastRow: {
        paddingBottom: 20,
        height: 25 + 20
    },
    codeFirstAndLastRow: {
        paddingBottom: 20,
        height: 25 + 40,
        paddingTop: 20
    },
    lineNum: {
        width: 55,
        color: 'rgba(255,255,255,0.5)',
        //backgroundColor: 'rgba(29,29,29,1)',
        //height: 25
    },
    lineNumWrapper: {
        width: 55,
        height: 25,
        backgroundColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        //paddingTop: 20
    },
    codeLine: {
        color: '#E74C3C',
        fontFamily: 'Courier'
    },
    codeWrapper: {
        flexDirection: 'column'
    },
    codeLineWrapper: {
        height: 25,
        //backgroundColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    blockquotewrapper: {
        paddingLeft: 20,
        borderLeftColor: '#3498DB',
        borderLeftWidth: 3
    }
});
