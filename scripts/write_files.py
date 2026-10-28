import json
import os
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

transcript = r'C:/Users/Roysa/.claude/projects/c--Users-Roysa-Desktop-PAGINAS-WEBS-rglimpiezasdecristales-master/feb9f09e-9ed7-4b3a-b6fe-03789ea47598.jsonl'

project_root = r'C:/Users/Roysa/Desktop/PAGINAS WEBS/rglimpiezasdecristales-master'

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

locale_targets = {
    'locales/es.js': 'src/locales/es.js',
    'locales/en.js': 'src/locales/en.js',
    'locales/fr.js': 'src/locales/fr.js',
    'locales/zh.js': 'src/locales/zh.js',
}

special_targets = {
    'Navbar.vue': 'src/components/Navbar.vue',
}

found_write = {}  # target -> (lineno, content) - stores LAST Write

print("Scanning transcript for Write tool calls...")

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
            if block.get('type') == 'tool_use' and block.get('name') == 'Write':
                inp = block.get('input', {})
                if not isinstance(inp, dict):
                    continue

                fp = inp.get('file_path', '')
                fp_fwd = fp.replace('\\', '/')

                file_content = inp.get('content', '')

                # Check simple filename targets
                for fname, target in target_names.items():
                    if fp_fwd.endswith(fname):
                        found_write[target] = (lineno, file_content)
                        print(f'[Write] {target} at line {lineno}, {len(file_content)} chars')

                # Check locale targets
                for partial, target in locale_targets.items():
                    if partial in fp_fwd:
                        found_write[target] = (lineno, file_content)
                        print(f'[Write] {target} at line {lineno}, {len(file_content)} chars')

                # Navbar
                for fname, target in special_targets.items():
                    if fp_fwd.endswith(fname):
                        found_write[target] = (lineno, file_content)
                        print(f'[Write] {target} at line {lineno}, {len(file_content)} chars')

print()

# Create directories
dirs_to_create = [
    os.path.join(project_root, 'src', 'components', 'home'),
    os.path.join(project_root, 'src', 'locales'),
]
for d in dirs_to_create:
    os.makedirs(d, exist_ok=True)
    print(f'Created/verified directory: {d}')

print()

# Write files
all_targets = list(target_names.values()) + list(locale_targets.values()) + list(special_targets.values())
written = []
missing = []

for target in all_targets:
    if target in found_write:
        lineno, content = found_write[target]
        out_path = os.path.join(project_root, target.replace('/', os.sep))
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'WRITTEN: {out_path} ({len(content)} chars, from line {lineno})')
        written.append(target)
    else:
        print(f'MISSING: {target}')
        missing.append(target)

print()
print(f'=== RESULTS ===')
print(f'Successfully written: {len(written)}/{len(all_targets)} files')
for t in written:
    print(f'  OK: {t}')
if missing:
    print(f'Missing:')
    for t in missing:
        print(f'  MISSING: {t}')
