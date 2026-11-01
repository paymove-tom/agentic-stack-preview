"""Mono (currentColor) wersje oficjalnych logotypów klientów na ciemne tło."""
import re
D = '/workspace/www-agentic/assets/clients/'
def _clean(s):
    s = s[s.index('<svg'):]
    s = re.sub(r'\s(width|height)="[^"]*"', '', s, count=2)
    return s.replace('<svg', '<svg aria-hidden="true" focusable="false"', 1)
def plain(name):
    s = _clean(open(D + name).read())
    s = re.sub(r'fill="(#[0-9A-Fa-f]{3,8}|black|white)"', 'fill="currentColor"', s)
    return re.sub(r'\s+', ' ', s)
def polin():
    s = open(D + 'polin-1.svg').read(); s = s[s.index('<svg'):]
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    body = s[s.index('>') + 1:s.rindex('</svg>')]
    # w masce: duże kwadraty = biały (widoczne), białe litery i mały czarny kwadrat na cyjanie = czarny (wycięte)
    body = body.replace('fill="white"', 'fill="@CUT"')                       # białe litery -> wycięte
    body = body.replace('fill="#62C3D6"', 'fill="@KEEP"')                     # cyjanowy kwadrat -> widoczny
    body = body.replace('d="M84 9H42V51H84V9Z" fill="#010101"', 'd="M84 9H42V51H84V9Z" fill="@KEEP"')  # czarny kwadrat -> widoczny
    body = body.replace('fill="#010101"', 'fill="@CUT"')                      # pozostałe czarne elementy na cyjanie -> wycięte
    body = body.replace('<path d="M84 9H0V51H84V9Z" fill="@CUT"/>', '<path d="M84 9H0V51H84V9Z" fill="white"/>')
    body = body.replace('@KEEP', 'white').replace('@CUT', 'black')
    body = re.sub(r'id="mask0_3027_12098"', 'id="pl-in"', body).replace('url(#mask0_3027_12098)', 'url(#pl-in)')
    return re.sub(r'\s+', ' ', f'<svg aria-hidden="true" focusable="false" viewBox="{vb}" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="pl-mono" maskUnits="userSpaceOnUse" x="0" y="0" width="96" height="60" style="mask-type:luminance"><rect width="96" height="60" fill="black"/>{body}</mask><rect width="96" height="60" fill="currentColor" mask="url(#pl-mono)"/></svg>')
LOGOS = [('ZOO Gdańsk', 'zoo', plain('zoo-gdansk.svg')), ('Muzeum POLIN', 'polin', polin()),
         ('PKP Mobility', 'pkp', plain('pkp-mobility.svg')), ('Sun & Snow', 'sunsnow', plain('sun-snow-1.svg'))]
def html():
    return '\n'.join(f'      <span class="client c-{k}" role="img" aria-label="{n}">{s}</span>' for n, k, s in LOGOS)
if __name__ == '__main__':
    open('/tmp/pm/mono.html', 'w').write('<body style="background:#111;color:#ccc;display:flex;gap:40px;padding:30px;align-items:center">' + ''.join(f'<span style="height:48px;display:block">{s.replace("<svg", "<svg style=\'height:48px;width:auto\'", 1)}</span>' for _, _, s in LOGOS) + '</body>')
