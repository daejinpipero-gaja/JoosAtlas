#!/usr/bin/env python3
"""Rebuild PACKAGE_MANIFEST.json, SHA256SUMS.txt and SHA256SUMS.json from the files
actually present.  Run from the site root:   python3 tools/make_manifest.py
"""
import hashlib, json, os, datetime
SKIP_FILES = {'PACKAGE_MANIFEST.json', 'SHA256SUMS.txt', 'SHA256SUMS.json'}
SKIP_DIRS = {'.git', 'node_modules', '__pycache__'}
files = []
for root, dirs, names in os.walk('.'):
    dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS)
    for n in sorted(names):
        p = os.path.relpath(os.path.join(root, n), '.').replace(os.sep, '/')
        if p in SKIP_FILES: continue
        data = open(p, 'rb').read()
        files.append({'path': p, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
files.sort(key=lambda f: f['path'])
ver = json.load(open('VERSION.json', encoding='utf-8'))
old = json.load(open('PACKAGE_MANIFEST.json', encoding='utf-8')) if os.path.exists('PACKAGE_MANIFEST.json') else {}
man = {
    'package': 'JoosAtlas_v%s_GitHub_Deploy' % ver['version'].split('.')[0],
    'version': ver['version'], 'codename': ver['codename'],
    'generated_utc': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
    'supersedes': ver.get('supersedes'),
    'deploy_target': 'https://daejinpipero-gaja.github.io/JoosAtlas/',
    'languages': ver.get('languages', ['en', 'ko']),
    'verification': old.get('verification', {}),
    'contact': old.get('contact', {}),
    'file_count': len(files), 'total_bytes': sum(f['bytes'] for f in files), 'files': files,
}
json.dump(man, open('PACKAGE_MANIFEST.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
open('SHA256SUMS.txt', 'w', encoding='utf-8').write(''.join('%s  %s\n' % (f['sha256'], f['path']) for f in files))
json.dump({f['path']: f['sha256'] for f in files}, open('SHA256SUMS.json', 'w', encoding='utf-8'), indent=2)
print('%d files, %d bytes' % (len(files), man['total_bytes']))
