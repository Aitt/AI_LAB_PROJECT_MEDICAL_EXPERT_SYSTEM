# ฟังก์ชันรับค่าจากผู้ใช้
def get_user_input(premise):
    user_input = input(f"Is {premise} true or false? (True/False): ").lower()
    return user_input == "true"


def separate_rules(rules):
    grouped_rules = []
    group = []

    for rule in rules:
        # เริ่มกลุ่มใหม่หากพบกฏที่ไม่มีความเกี่ยวข้องกับกลุ่มก่อนหน้า
        if len(group) == 0:
            group.append(rule)
        else:
            # ตรวจสอบว่ากฏใหม่มีตัวแปรที่เชื่อมโยงกับกฏในกลุ่มหรือไม่
            related_to_group = False
            for r in group:
                if rule["premise1"] == r["conclude1"] or rule["premise1"] == r["conclude2"] \
                        or rule["premise2"] == r["conclude1"] or rule["premise2"] == r["conclude2"]:
                    related_to_group = True
                    break
            
            # ถ้ากฏใหม่ไม่เกี่ยวข้องกับกฏในกลุ่ม ให้ปิดกลุ่มเดิมและสร้างกลุ่มใหม่
            if not related_to_group:
                grouped_rules.append(group)
                group = [rule]
            else:
                group.append(rule)

    # เพิ่มกลุ่มสุดท้ายที่เหลือ
    grouped_rules.append(group)

    return grouped_rules

# ฟังก์ชันสำหรับรับค่าจากผู้ใช้และหาผลลัพธ์สุดท้ายของกลุ่มกฎ
def find_final_conclusions(grouped_rules):
    final_conclusions = []

    for group in grouped_rules:
        known_values = {}
        final_conclusion = "ไม่มีอาการที่เกี่ยวข้อง"

        while True:
            new_values_added = False

            for rule in group:
                premise1 = rule["premise1"]
                premise2 = rule.get("premise2")
                operator = rule.get("operator")
                conclude1 = rule["conclude1"]
                conclude2 = rule.get("conclude2")

                # ตรวจสอบ Premise และ Conclude ที่มีค่าและไม่ใช่ None
                if premise1 not in known_values and premise1 is not None:
                    known_values[premise1] = get_user_input(premise1)

                if premise2 not in known_values and premise2 is not None:
                    known_values[premise2] = get_user_input(premise2)

                # ข้ามกฎนี้หากเงื่อนไขต้นที่สองยังไม่มีค่า
                if premise2 and premise2 not in known_values:
                    continue

                value1 = known_values[premise1]
                value2 = known_values.get(premise2)

                if operator == "and":
                    result1 = value1 and value2
                    result2 = value1 and value2
                elif operator == "or":
                    result1 = value1 or value2
                    result2 = value1 or value2
                else:
                    result1 = value1
                    result2 = value1

                # ข้ามกฎนี้หากผลสรุปทั้งสองมีค่าอยู่แล้ว
                if (conclude1 in known_values and known_values[conclude1] == result1) and \
                   (conclude2 is None or (conclude2 in known_values and known_values[conclude2] == result2)):
                    continue

                known_values[conclude1] = result1
                if conclude2:
                    known_values[conclude2] = result2

                new_values_added = True

                # ตรวจสอบว่ากฎนี้มีคำตอบสุดท้ายหรือไม่
                all_premises = [premise1] + ([premise2] if premise2 else [])
                all_conclusions = [conclude1, conclude2] if conclude2 else [conclude1]

                for conclusion in all_conclusions:
                    if conclusion not in all_premises and known_values[conclusion]:
                        final_conclusion = conclusion
                        break

            # หยุดวนลูปหากไม่มีกฎใหม่ที่สามารถนำมาใช้ได้อีก
            if not new_values_added:
                break

        final_conclusions.append(final_conclusion)

    return final_conclusions

# การใช้งาน
rules = [
    {"premise1": "A", "operator": "and", "premise2": "B", "conclude1": "G", "conclude2": None},
    {"premise1": "G", "operator": "and", "premise2": "F", "conclude1": "J", "conclude2": None},
    {"premise1": "J", "operator": None, "premise2": None, "conclude1": "X", "conclude2": None},
    {"premise1": "C", "operator": "and", "premise2": "D", "conclude1": "H", "conclude2": None},
    {"premise1": "E", "operator": None, "premise2": None, "conclude1": "I", "conclude2": None},
    {"premise1": "H", "operator": "and", "premise2": "I", "conclude1": "K", "conclude2": None},
    {"premise1": "K", "operator": None, "premise2": None, "conclude1": "Y", "conclude2": None},
]




grouped_rules = separate_rules(rules)
final_conclusions = find_final_conclusions(grouped_rules)

# แสดงผลลัพธ์
for i, final_conclusion in enumerate(final_conclusions):
    print(f"ผลลัพธ์ที่  {i+1} คือ : {final_conclusion}")
