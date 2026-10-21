import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript = r'C:/Users/Roysa/.claude/projects/c--Users-Roysa-Desktop-PAGINAS-WEBS-rglimpiezasdecristales-master/feb9f09e-9ed7-4b3a-b6fe-03789ea47598.jsonl'

project_root = r'C:/Users/Roysa/Desktop/PAGINAS WEBS/rglimpiezasdecristales-master'

# Target files we care about
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
    'Navbar.vue': 'src/components/Navbar.vue',
}

locale_targets = {
    'locales/es.js': 'src/locales/es.js',
    'locales/en.js': 'src/locales/en.js',
    'locales/fr.js': 'src/locales/fr.js',
    'locales/zh.js': 'src/locales/zh.js',
}

def match_target(fp_fwd):
    for fname, target in target_names.items():
        if fp_fwd.endswith(fname):
            return target
    for partial, target in locale_targets.items():
        if partial in fp_fwd:
            return target
    return None

# Collect all operations (Write and Edit) in order
operations = []  # list of (lineno, op_type, target, data)

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

# Now replay operations to get final state of each file
file_states = {}  # target -> current content

edit_errors = {}  # target -> list of error messages

for lineno, op_type, target, data in operations:
    if op_type == 'Write':
        file_states[target] = data
    elif op_type == 'Edit':
        if target not in file_states:
            print(f'WARNING: Edit at line {lineno} for {target} but no prior Write found, skipping')
            continue
        current = file_states[target]
        old_string = data['old_string']
        new_string = data['new_string']
        replace_all = data['replace_all']

        if old_string not in current:
            msg = f'EDIT MISMATCH at line {lineno} for {target}: old_string not found'
            print(msg)
            if target not in edit_errors:
                edit_errors[target] = []
            edit_errors[target].append(msg)
            # Don't apply this edit, keep current state
        else:
            if replace_all:
                file_states[target] = current.replace(old_string, new_string)
            else:
                file_states[target] = current.replace(old_string, new_string, 1)

print()

# Write final states
all_targets = list(target_names.values()) + list(locale_targets.values())
written = []
missing = []

for target in all_targets:
    out_path = os.path.join(project_root, target.replace('/', os.sep))
    if target in file_states:
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(file_states[target])
        errs = edit_errors.get(target, [])
        err_note = f' ({len(errs)} edit errors)' if errs else ''
        print(f'WRITTEN: {target} ({len(file_states[target])} chars){err_note}')
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
    print('Files with edit application errors (partial content):')
    for t, errs in edit_errors.items():
        print(f'  {t}: {len(errs)} errors')
