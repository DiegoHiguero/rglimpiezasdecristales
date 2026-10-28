import json
import os
import sys

transcript = r'C:/Users/Roysa/.claude/projects/c--Users-Roysa-Desktop-PAGINAS-WEBS-rglimpiezasdecristales-master/feb9f09e-9ed7-4b3a-b6fe-03789ea47598.jsonl'

# Map from filename (or partial path) to the canonical target path
target_names = {
    'Servicios.vue': 'src/views/Servicios.vue',
    'HomeStats.vue': 'src/components/home/HomeStats.vue',
    'HomeServicios.vue': 'src/components/home/HomeServicios.vue',
    'HomePrecios.vue': 'src/components/home/HomePrecios.vue',
    'HomeGaleria.vue': 'src/components/home/HomeGaleria.vue',
    'HomeTestimonios.vue': 'src/components/home/HomeTestimonios.vue',
    'HomeVentajas.vue': 'src/components/home/HomeVentajas.vue',
    'HomeFaq.vue': 'src/components/home/HomeFaq.vue',
    'i18n.js': 'src/i18n.js',
}

# These need disambiguation (es.js, en.js could be many files)
locale_targets = {
    'locales/es.js': 'src/locales/es.js',
    'locales/en.js': 'src/locales/en.js',
    'locales/fr.js': 'src/locales/fr.js',
    'locales/zh.js': 'src/locales/zh.js',
}

# Also include Navbar but be careful (could appear in edits)
special_targets = {
    'Navbar.vue': 'src/components/Navbar.vue',
}

found_write = {}  # target -> (lineno, content)
found_edit = {}   # target -> list of (lineno, old_string, new_string)

print("Scanning transcript...")

with open(transcript, 'r', encoding='utf-8') as f:
    for lineno, line in enumerate(f, 1):
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except Exception as e:
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
                name = block.get('name', '')
                inp = block.get('input', {})
                if not isinstance(inp, dict):
                    continue

                fp = inp.get('file_path', '')
                fp_fwd = fp.replace('\\', '/')  # normalize to forward slashes

                if name == 'Write':
                    # Check simple filename targets
                    for fname, target in target_names.items():
                        if fp_fwd.endswith(fname):
                            found_write[target] = (lineno, inp.get('content', ''))
                            print(f'[Write] {target} at line {lineno}, {len(inp.get("content",""))} chars')
                    # Check locale targets (need partial path match)
                    for partial, target in locale_targets.items():
                        if partial in fp_fwd:
                            found_write[target] = (lineno, inp.get('content', ''))
                            print(f'[Write] {target} at line {lineno}, {len(inp.get("content",""))} chars')
                    # Navbar
                    for fname, target in special_targets.items():
                        if fp_fwd.endswith(fname):
                            found_write[target] = (lineno, inp.get('content', ''))
                            print(f'[Write] {target} at line {lineno}, {len(inp.get("content",""))} chars')

                elif name == 'Edit':
                    for fname, target in target_names.items():
                        if fp_fwd.endswith(fname):
                            if target not in found_edit:
                                found_edit[target] = []
                            found_edit[target].append((lineno, inp.get('old_string',''), inp.get('new_string','')))
                            print(f'[Edit] {target} at line {lineno}')
                    for partial, target in locale_targets.items():
                        if partial in fp_fwd:
                            if target not in found_edit:
                                found_edit[target] = []
                            found_edit[target].append((lineno, inp.get('old_string',''), inp.get('new_string','')))
                            print(f'[Edit] {target} at line {lineno}')
                    for fname, target in special_targets.items():
                        if fp_fwd.endswith(fname):
                            if target not in found_edit:
                                found_edit[target] = []
                            found_edit[target].append((lineno, inp.get('old_string',''), inp.get('new_string','')))
                            print(f'[Edit] {target} at line {lineno}')

print()
print("=== SUMMARY ===")
all_targets = list(target_names.values()) + list(locale_targets.values()) + list(special_targets.values())
for target in all_targets:
    if target in found_write:
        print(f'  FOUND (Write): {target}')
    elif target in found_edit:
        print(f'  FOUND (Edit only, {len(found_edit[target])} edits): {target}')
    else:
        print(f'  MISSING: {target}')

print()
print("Last Write content for each found file:")
for target, (lineno, content) in found_write.items():
    print(f'  {target}: {content[:100]}...')
