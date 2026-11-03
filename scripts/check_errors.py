import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript = r'C:/Users/Roysa/.claude/projects/c--Users-Roysa-Desktop-PAGINAS-WEBS-rglimpiezasdecristales-master/feb9f09e-9ed7-4b3a-b6fe-03789ea47598.jsonl'

# Check the failed edits: Navbar line 3097, 3131, 3136; HomePrecios line 2026; Servicios line 3103

error_lines = [2026, 3097, 3103, 3131, 3136]

with open(transcript, 'r', encoding='utf-8') as f:
    for lineno, line in enumerate(f, 1):
        if lineno not in error_lines:
            continue
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except Exception:
            continue

        if obj.get('type') != 'assistant':
            print(f'Line {lineno}: not assistant type, skipping')
            continue

        msg = obj.get('message', {})
        content_list = msg.get('content', []) if isinstance(msg, dict) else []

        for block in content_list:
            if not isinstance(block, dict):
                continue
            if block.get('type') == 'tool_use' and block.get('name') == 'Edit':
                inp = block.get('input', {})
                fp = inp.get('file_path', '')
                old = inp.get('old_string', '')
                new = inp.get('new_string', '')
                print(f'Line {lineno}: Edit to {fp}')
                print(f'  old_string: {old[:300]}')
                print(f'  new_string: {new[:300]}')
                print()
