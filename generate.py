# coding=utf8
# author: LegendLee
# module: Generate Index Page
import random

# scale configure
length = 1 # for 1k

# write out to `intex.html`
index_html = open('index.html', 'w')

# lambda random function
rand = lambda x: chr(97 + random.randint(0, 25))

# get data by scale parameter `length`
def get_data():
    """
        return `p` tag with length * 1024 chars
    """
    block = length * 1024 
    print block
    p_str = ''.join(map(rand, range(block)))
    print len(p_str)
    return '<p id="case" class="case">' + p_str + '</p>\n'

# get div as you like
def get_div():
    lists = []
    lists.append('<h2>Performance Test Index</h2>\n')
    lists.append('<button id="testBtn">Test</button>\n')
    lists.append('<canvas id="myCanvas" width="200" ' \
                 + 'height="100"></canvas>\n')
    lists.append('<p>Test Data:</p>\n')
    lists.append(get_data())
    return lists

# get html format by recrusion
def get_html(level):
    if level == 'html':
        return '<html>\n' + get_html('head') \
                + get_html('body') + '\n</html>'
    elif level == 'head':
        text = '<head>\n<meta charset="utf-8"/>\n'
        text += get_html('title')
        text += get_html('css')
        text += get_html('script')
        return text + '</head>\n'
    elif level == 'body':
        body_list = get_div()
        div = '<div class="main">\n'
        for bl in body_list:
            div += bl
        div += '</div>\n'
        return '<body>\n' + div + '\n</body>'
    elif level == 'title':
        return '<title>Performance Test Index</title>\n'
    elif level == 'css':
        return '<link href="css/perf_test.css"' \
                + 'rel="stylesheet">\n'
    elif level == 'script':
        return '<script language="javascript" ' \
               + 'src="js/perf_test.js"></script>\n'
    elif level == 'data':
        return get_data()

def generate():
    html = '<!DOCTYPE html>' + get_html('html')
    html = unicode(html, 'utf-8')
    index_html.write(html)
    print '=====> Generate Done!'


if __name__ == "__main__":
    generate()
