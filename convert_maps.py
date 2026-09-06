import json

# 1. Convert frontend JSON
with open('frontend/src/data/scenarios.json', 'r') as f:
    data = json.load(f)

for s in data['scenarios']:
    if 'map' in s:
        s['floors'] = [s['map']]
        del s['map']

with open('frontend/src/data/scenarios.json', 'w') as f:
    json.dump(data, f, indent=2)

# 2. Convert scenarios.py
with open('backend/app/api/v1/scenarios.py', 'r') as f:
    code = f.read()

code = code.replace('"map": [', '"floors": [[')
code = code.replace('],\n        "blockages"', ']],\n        "blockages"')
code = code.replace('],\n    },', ']],\n    },')

# 3. Also update the Gemini JSON Schema inside scenarios.py
code = code.replace(
'''            "map": {
                "type": "ARRAY",
                "items": {"type": "STRING"}
            },''',
'''            "floors": {
                "type": "ARRAY",
                "items": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                }
            },'''
)
code = code.replace('"map", "blockages"', '"floors", "blockages"')

with open('backend/app/api/v1/scenarios.py', 'w') as f:
    f.write(code)
print("Conversion complete.")
