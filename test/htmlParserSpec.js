require('mocha')

var chai = require('chai')
    , expect = chai.expect
    , should = chai.should()

delete require.cache[require.resolve('../lib/htmlParse')]


var htmlParse = require('../lib/htmlParse')


describe('htmlParse', function () {
    it('should exist', function () {
        expect(htmlParse).to.be.exist
    })

    it('should be a function', function () {
        expect(htmlParse).to.be.a('function')
    })




})
