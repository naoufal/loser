const fs = require('fs');
const convert = require('xml-js');
const XML_STRINGS_CONTENT = fs.readFileSync('./strings.xml', 'utf8');
const CONTAINS_HTML_TAG_REGEX = /<[a-z][\s\S]*>/i

const result = convert.xml2js(XML_STRINGS_CONTENT);

const nextElements = result.elements[0].elements.map(element => {
    const hasNestedHtml = element.elements && element.elements.length > 1;

    return {
        type: 'element',
        name: 'string',
        attributes: {
            name: element.attributes.name
        },
        elements: [{
            type: 'text',
            text: hasNestedHtml ? `<![CDATA[${convert.js2xml(element)}]]>` : convert.js2xml(element)
        }]
    }
})

const nextXML = convert.js2xml(Object.assign(result, {}, {
    elements: [{
        type: 'element',
        name: 'resources',
        elements: nextElements
    }]
}), {
    spaces: 4
})

fs.writeFile('nextStrings.xml', nextXML, (err) => {
    if (err) {
        throw err
    }

    console.log('all done, homie');
    console.log(`Open ${__dirname}/nextStrings.xml`)
});