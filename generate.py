# coding=utf8
import random

method = 'linear'
# method = 'power'
k, p, length = 100, 10, 20
rand = lambda x: chr(97 + random.randint(0, 25))
index_html = open('index.html', 'w')


def get_data():
    p_str = []

    start = 100
    for pi in xrange(1, length):
        p_str.append(''.join(map(rand, range(start + k))))
        start += k

    text = ''
    for pi in p_str:
        text += '<p>' + pi + '</p>\n'
    return text

def get_html(level):
    if level == 'html':
        return '<html>\n' + get_html('head') \
                + get_html('body') + '\n</html>'
    elif level == 'head':
        text = '<head>\n<meta charset="utf-8"/>\n'
        text += get_html('title')
        text += get_html('script')
        return text + '</head>\n'
    elif level == 'body':
        h2 = '<h2>Performance Test Index</h2>\n'
        btn = '<button id="testBtn">Test</button>\n'
        canvas = '<canvas id="myCanvas" width="200" ' \
                 + 'height="100"></canvas>\n'
        div = '<div class="main">\n' + h2 + btn + canvas \
              + get_html('data') + '</div>\n'
        return '<body>\n' + div + '\n</body>'
    elif level == 'title':
        return '<title>Performance Test Index</title>\n'
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
