
import re
import json

file_path = r'e:\Cursor\Induction 02\IKF TimeSheet - Team Board.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for each employee entry
# Note: The structure might be slightly different for different entries, but let's try this.
# <div class="usr-name"><strong>Ashish Dalia</strong></div>
# <div class="user-designation">CEO</div>
# <div class="bdayanni-date">Birthday🎂 : 03-May-1975</div>
# <div class="bdayanni-date">Date of joining: 01-Jan-2000</div>

# Using a more robust regex that handles potential variations
entries = re.findall(r'<div style="text-align: center;">.*?<div class="usr-name"><strong>(.*?)</strong></div>.*?<div class="user-designation">(.*?)</div>.*?Birthday.*? : (.*?)</div>.*?Date of joining: (.*?)</div>.*?Email-Id : (.*?)</div>', content, re.DOTALL)

data = []
for entry in entries:
    name, role, dob, doj, email = entry
    data.append({
        'name': name.strip(),
        'role': role.strip(),
        'dob': dob.strip(),
        'doj': doj.strip(),
        'email': email.strip()
    })

with open('extracted_employees.json', 'w') as f:
    json.dump(data, f, indent=4)

print(f"Extracted {len(data)} employees.")
