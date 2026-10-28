import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript = r'C:/Users/Roysa/.claude/projects/c--Users-Roysa-Desktop-PAGINAS-WEBS-rglimpiezasdecristales-master/feb9f09e-9ed7-4b3a-b6fe-03789ea47598.jsonl'

project_root = r'C:/Users/Roysa/Desktop/PAGINAS WEBS/rglimpiezasdecristales-master'

# All target files - use EXACT path ending to avoid false matches
# e.g., HomeServicios.vue should NOT match Servicios.vue
target_exact_endings = [
    ('views/Servicios.vue', 'src/views/Servicios.vue'),
    ('components/home/HomeStats.vue', 'src/components/home/HomeStats.vue'),
    ('components/home/HomeServicios.vue', 'src/components/home/HomeServicios.vue'),
    ('components/home/HomePrecios.vue', 'src/components/home/HomePrecios.vue'),
    ('components/home/HomeGaleria.vue', 'src/components/home/HomeGaleria.vue'),
    ('components/home/HomeTestimonios.vue', 'src/components/home/HomeTestimonios.vue'),
    ('components/home/HomeVentajas.vue', 'src/components/home/HomeVentajas.vue'),
    ('components/home/HomeFaq.vue', 'src/components/home/HomeFaq.vue'),
    ('src/i18n.js', 'src/i18n.js'),
    ('components/Navbar.vue', 'src/components/Navbar.vue'),
    ('locales/es.js', 'src/locales/es.js'),
    ('locales/en.js', 'src/locales/en.js'),
    ('locales/fr.js', 'src/locales/fr.js'),
    ('locales/zh.js', 'src/locales/zh.js'),
]

def match_target(fp_fwd):
    """Match file path to target. Use exact path endings."""
    # Normalize: remove drive prefix if any, use forward slashes
    fp_lower = fp_fwd.lower().replace('\\', '/')
    for ending, target in target_exact_endings:
        # ending uses forward slashes
        ending_lower = ending.lower().replace('\\', '/')
        if fp_lower.endswith(ending_lower):
            return target
    return None

# Collect all operations (Write and Edit) in order
operations = []

print("Scanning transcript...")

with open(transcript, 'r', encoding='utf-8') as f:
    for lineno, line in enumerate(f, 1):
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
        content_list = msg.get('content', []) if isinstance(msg, dict) else []

        if not isinstance(content_list, list):
            continue

        for block in content_list:
            if not isinstance(block, dict):
                continue
            if block.get('type') == 'tool_use':
                name = block.get('name', '')
                inp = block.get('input', {})
                if not isinstance(inp, dict):
                    continue

                fp = inp.get('file_path', '')
                fp_fwd = fp.replace('\\', '/')
                target = match_target(fp_fwd)

                if target is None:
                    continue

                if name == 'Write':
                    operations.append((lineno, 'Write', target, inp.get('content', '')))
                elif name == 'Edit':
                    operations.append((lineno, 'Edit', target, {
                        'old_string': inp.get('old_string', ''),
                        'new_string': inp.get('new_string', ''),
                        'replace_all': inp.get('replace_all', False),
                    }))

print(f"Found {len(operations)} total operations")
print()

# Show operations summary per file
from collections import defaultdict
ops_by_file = defaultdict(list)
for lineno, op, target, data in operations:
    ops_by_file[target].append((lineno, op))

for target, ops in sorted(ops_by_file.items()):
    last_write = max((ln for ln, op in ops if op == 'Write'), default=None)
    edits_after = [(ln, op) for ln, op in ops if op == 'Edit' and (last_write is None or ln > last_write)]
    print(f'{target}:')
    print(f'  Writes: {[ln for ln,op in ops if op=="Write"]}')
    print(f'  Edits after last write: {[ln for ln, op in edits_after]}')
print()

# Replay operations
file_states = {}
edit_errors = defaultdict(list)
edit_ok = defaultdict(int)

for lineno, op_type, target, data in operations:
    if op_type == 'Write':
        file_states[target] = data
        print(f'[Write] {target} at line {lineno}, {len(data)} chars')
    elif op_type == 'Edit':
        if target not in file_states:
            continue  # No base to edit
        current = file_states[target]
        old_string = data['old_string']
        new_string = data['new_string']
        replace_all = data['replace_all']

        if old_string not in current:
            edit_errors[target].append(lineno)
        else:
            if replace_all:
                file_states[target] = current.replace(old_string, new_string)
            else:
                file_states[target] = current.replace(old_string, new_string, 1)
            edit_ok[target] += 1

print()

# Write files
all_targets = [t for _, t in target_exact_endings]
written = []
missing = []

for target in all_targets:
    out_path = os.path.join(project_root, target.replace('/', os.sep))
    if target in file_states:
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(file_states[target])
        n_ok = edit_ok.get(target, 0)
        n_err = len(edit_errors.get(target, []))
        print(f'WRITTEN: {target} ({len(file_states[target])} chars, {n_ok} edits applied, {n_err} edit errors)')
        written.append(target)
    else:
        print(f'MISSING: {target}')
        missing.append(target)

print()
print(f'=== FINAL RESULTS ===')
print(f'Written: {len(written)}/{len(all_targets)}')
if missing:
    print(f'Missing: {missing}')
if edit_errors:
    print()
    print('Files with edit errors (old_string not found - these edits were skipped):')
    for t, lines in sorted(edit_errors.items()):
        print(f'  {t}: {len(lines)} errors at lines {lines[:10]}')
