# coding=utf8
# author: LegendLee
# module: Generate Index Page
# description: using json to write `index.html`
from random import randint
import codecs
import traceback
import getopt
import json

from xml.dom.minidom import Document

# scale configure
length = 1 # for 1k
unit = 1024
scale = {'k': 1, 'm': 2, 'g': 3}

# lambda random function
rand = lambda x: chr(97 + randint(0, 25))

# attributes sets
attr = ('id', 'class', 'charset', 'width', 'height')

# write out to `intex.html`
index_html = open('index.html', 'w')

# load json data
data = json.load(codecs.open('index.json'))


# generate fixed scale text
def gen_rand():
    """
        return text with length * 1024 chars
    """
    block = length * pow(unit, scale['k'])
    p_str = ''.join(map(rand, range(block)))
    return p_str

# parse one element with special method
def parse_element(doc, root, j):
    if isinstance(j, dict):
        for key in j.keys():
            value = j[key]
            if isinstance(value, list):
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
                else:
                    for e in value:
                        elem = doc.createElement(key)
                        parse_element(doc, elem, e)
                        root.appendChild(elem)
            else:
                if key in attr:
                    root.setAttribute(key, value)
                elif key == 'text':
                    # gen_data
                    if value is None:
                        text = doc.createTextNode(gen_rand())
                    else:
                        text = doc.createTextNode(value)
                    root.appendChild(text)
                else:
                    elem = doc.createElement(key)
                    parse_element(doc, elem, value)
                    root.appendChild(elem)
    elif isinstance(j, str) or isinstance(j, unicode):
        text = doc.createTextNode(j)
        root.appendChild(text)
    else:
        raise Exception("bad type %s for %s" % (type(j), j))

# parse json by module Document at xml.dom.minidom
def parse_doc(html, j):
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
    assert data != None
    text = ''
    if 'html5' in data:
        text += '<!DOCTYPE html>\n'
    if 'html' in data:
        doc = parse_doc('html', data['html'])
        text += doc.toprettyxml(encoding="utf-8", indent=" ")
    print text
    index_html.write(text)

# main function 
def main():
    json2html()


# main program
if __name__ == "__main__":
    main()
