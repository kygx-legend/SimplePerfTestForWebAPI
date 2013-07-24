# coding=utf8
# author: LegendLee
# module: Generate Index Page
# description: using `index.json` to write `index.html`
# usage:
#   1. Modify the file named `index.json`.
#   2. The format must follow json.
#   3. Configure the test case unit scale.
#   4. By varibles: length, unit, scale.

from random import randint
import codecs
import traceback
import getopt
import json

from xml.dom.minidom import Document

# scale configure
length = 1 # for 1k
unit = 1024
scale = 'k'
space = {'k': 1, 'm': 2, 'g': 3}

# lambda random function
rand = lambda x: chr(97 + randint(0, 25))

# attributes sets
attr = ('id', 'class', 'charset', 'width', 'height') + \
       ('type', 'placeholder', 'value')

# write out to `intex.html`
index_html = open('index.html', 'w')

# load json data
data = json.load(codecs.open('index.json'))


# generate fixed scale text
def gen_rand():
    """
        return text with length * unit chars
    """
    block = length * pow(unit, space[scale])
    p_str = ''.join(map(rand, range(block)))
    return p_str

# parse one element with special method
def parse_element(doc, root, j):
    """
        recursion of parsing like dps.
    """
    if isinstance(j, dict):
        for key in j.keys():
            value = j[key]
            if isinstance(value, list):
                # for a list
                if key == 'css':
                    for e in value:
                        elem = doc.createElement('link')
                        elem.setAttribute('href', e['href'])
                        elem.setAttribute('rel', 'stylesheet')
                        root.appendChild(elem)
                elif key == 'script':
                    for e in value:
                        elem = doc.createElement(key)
                        elem.setAttribute('src', e['src'])
                        elem.setAttribute('language', 'javascript')
                        text = doc.createTextNode('')
                        elem.appendChild(text)
                        root.appendChild(elem)
                # a list of same tags
                else:
                    for e in value:
                        elem = doc.createElement(key)
                        parse_element(doc, elem, e)
                        root.appendChild(elem)
            else:
                # add attribute
                if key in attr:
                    root.setAttribute(key, value)
                # parse the content
                elif key == 'text':
                    # gen_data
                    if value is None:
                        text = doc.createTextNode(gen_rand())
                    # add test case space specifiation
                    elif value == "space":
                        cont = "Test Case Unit: %d * %d chars (%s)" % \
                               (length, pow(unit, space[scale]), scale)
                        text = doc.createTextNode(cont)
                    else:
                        text = doc.createTextNode(value)
                    root.appendChild(text)
                # parse the normal element 
                else:
                    elem = doc.createElement(key)
                    parse_element(doc, elem, value)
                    root.appendChild(elem)
    # for text leaves
    elif isinstance(j, str) or isinstance(j, unicode):
        text = doc.createTextNode(j)
        root.appendChild(text)
    # parse error
    else:
        raise Exception("bad type %s for %s" % (type(j), j))

# parse json by module Document at xml.dom.minidom
def parse_doc(html, j):
    """
        parse json by minidom.Document.
        return doc of type xml Document.
    """
    doc = Document()
    html = doc.createElement(html)
    if 'head' in j:
        head = doc.createElement('head')
        parse_element(doc, head, j['head'])
        html.appendChild(head)
    if 'body' in j:
        body = doc.createElement('body')
        parse_element(doc, body, j['body'])
        html.appendChild(body)
    doc.appendChild(html)
    return doc

# change json format to html
def json2html():
    """
        return html content.
    """
    assert data != None
    text = ''
    if 'html5' in data:
        text += '<!DOCTYPE html>\n'
    if 'html' in data:
        doc = parse_doc('html', data['html'])
        text += doc.toprettyxml(encoding="utf-8", indent=" ")
    index_html.write(text)
    print text
    print '======> Done!'

# main function 
def main():
    json2html()


# main program
if __name__ == "__main__":
    main()
