#!/usr/bin/env python3
import os
from pathlib import Path
from collections import defaultdict

def count_lines(directory, extensions):
    stats = defaultdict(lambda: {'files': 0, 'lines': 0, 'code': 0, 'comments': 0, 'blank': 0})
    
    for root, dirs, files in os.walk(directory):
        # Skip common folders
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', '.next', 'dist', 'build']]
        
        for file in files:
            ext = Path(file).suffix.lower()
            if ext in extensions:
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        stats[ext]['files'] += 1
                        stats[ext]['lines'] += len(lines)
                        
                        for line in lines:
                            stripped = line.strip()
                            if not stripped:
                                stats[ext]['blank'] += 1
                            elif stripped.startswith('#') or stripped.startswith('//'):
                                stats[ext]['comments'] += 1
                            else:
                                stats[ext]['code'] += 1
                except:
                    pass
    
    return stats

# Frontend extensions
frontend_exts = {'.tsx', '.ts', '.jsx', '.js', '.css', '.json'}
# Backend extensions
backend_exts = {'.py'}

base_path = r'c:\Users\user\BBC ai chatbot frontend'

print('=' * 70)
print('FRONTEND (bbc-admin-app)')
print('=' * 70)
frontend_path = os.path.join(base_path, 'bbc-admin-app', 'src')
frontend_stats = count_lines(frontend_path, frontend_exts)
total_frontend_files = sum(s['files'] for s in frontend_stats.values())
total_frontend_code = sum(s['code'] for s in frontend_stats.values())

for ext in sorted(frontend_stats.keys()):
    s = frontend_stats[ext]
    print(f'{ext:12} {s["files"]:3} files  {s["code"]:6} code  {s["comments"]:4} comments  {s["blank"]:4} blank  ({s["lines"]:6} total)')

print(f'{"TOTAL":12} {total_frontend_files:3} files  {total_frontend_code:6} code  lines')

print()
print('=' * 70)
print('BACKEND (bbc-chatbot-api)')
print('=' * 70)
backend_path = os.path.join(base_path, 'bbc-chatbot-api', 'app')
backend_stats = count_lines(backend_path, backend_exts)
total_backend_files = sum(s['files'] for s in backend_stats.values())
total_backend_code = sum(s['code'] for s in backend_stats.values())

for ext in sorted(backend_stats.keys()):
    s = backend_stats[ext]
    print(f'{ext:12} {s["files"]:3} files  {s["code"]:6} code  {s["comments"]:4} comments  {s["blank"]:4} blank  ({s["lines"]:6} total)')

print(f'{"TOTAL":12} {total_backend_files:3} files  {total_backend_code:6} code  lines')
