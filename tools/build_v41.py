#!/usr/bin/env python3
"""index-v41.src.html -> index.html (v4.1). Makieta telefonu hero z build_v4 (bez czipu portfela); logotypy klientów: oficjalne wektory, mono."""
import os, sys
H = os.path.dirname(os.path.abspath(__file__)); S = os.path.dirname(H); sys.path.insert(0, H)
import importlib.util
spec = importlib.util.spec_from_file_location('b4', os.path.join(H, 'build_v4.py'))
src4 = open(os.path.join(H, 'build_v4.py')).read()
ns = {'__file__': os.path.join(H, 'build_v4.py')}
exec(src4[:src4.index("src = open(")], ns)   # tylko definicje PHONE/TOAST
from logos_v41 import html as clients
src = open(os.path.join(H, 'index-v41.src.html')).read()
for k, v in {'{{PHONE}}': ns['PHONE'], '{{TOAST}}': ns['TOAST'], '{{CLIENTS}}': clients()}.items():
    src = src.replace(k, v)
assert '{{' not in src
open(os.path.join(S, 'index.html'), 'w').write(src); print('index.html v4.1', len(src))
