import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript = r'C:/Users/Roysa/.claude/projects/c--Users-Roysa-Desktop-PAGINAS-WEBS-rglimpiezasdecristales-master/feb9f09e-9ed7-4b3a-b6fe-03789ea47598.jsonl'

# Check what happens with HomeServicios.vue at line 3270
# It seems the same line 3270 matched both Servicios.vue and HomeServicios.vue

with open(transcript, 'r', encoding='utf-8') as f:
    for lineno, line in enumerate(f, 1):
        if lineno < 3268:
            continue
        if lineno > 3285:
            break
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except Exception:
            continue

        if obj.get('type') != 'assistant':
            continue

        msg = obj.get('message', {})
        content = msg.get('content', []) if isinstance(msg, dict) else []

        if not isinstance(content, list):
            continue

        for block in content:
            if not isinstance(block, dict):
                continue
            if block.get('type') == 'tool_use' and block.get('name') == 'Write':
                inp = block.get('input', {})
                fp = inp.get('file_path', '')
                print(f'Line {lineno}: Write to: {fp}')
                print(f'  Content length: {len(inp.get("content",""))}')
                print(f'  First 200 chars: {inp.get("content","")[:200]}')
                print()

# Also look at the Servicios.vue edits around line 3390+ to understand what's happening
print("\n=== Checking failed Servicios.vue edits ===")
with open(transcript, 'r', encoding='utf-8') as f:
    for lineno, line in enumerate(f, 1):
        if lineno < 3385:
            continue
        if lineno > 3425:
            break
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except Exception:
            continue

        if obj.get('type') != 'assistant':
            continue

        msg = obj.get('message', {})
        content = msg.get('content', []) if isinstance(msg, dict) else []

        if not isinstance(content, list):
            continue

        for block in content:
            if not isinstance(block, dict):
                continue
            if block.get('type') == 'tool_use':
                inp = block.get('input', {})
                fp = inp.get('file_path', '').replace('\\', '/')
                if 'Servicios' in fp:
                    print(f'Line {lineno}: {block.get("name")} to: {fp}')
                    if block.get('name') == 'Edit':
                        old = inp.get('old_string', '')
                        new = inp.get('new_string', '')
                        print(f'  old_string (first 150): {old[:150]}')
                        print(f'  new_string (first 150): {new[:150]}')
                    print()
