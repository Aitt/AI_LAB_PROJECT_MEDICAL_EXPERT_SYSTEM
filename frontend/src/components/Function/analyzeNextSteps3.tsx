import { Knowledge, RuleInterface } from "../../interface";

function get_user_input(premise: string): boolean {
    const user_input = prompt(`Is ${premise} true or false? (True/False): `)?.toLowerCase();
    return user_input === "true";
}

function get_rules_from_database(): RuleInterface[] {
  
    const rulee: RuleInterface[] = [];
    const rulesData = relationOfRule(rulee);
    return rulesData;
}

function relationOfRule(dataRules: RuleInterface[]) {
    const relationRule: any[] = [];
    for (const rule of dataRules) {
        const rulee = [];
        rulee.push(rule.Node1 || "");
        rulee.push(rule.Operator || "");
        rulee.push(rule.Node2 || "");
        rulee.push(rule.Result1 || "");
        rulee.push(rule.Result2 || "");
        relationRule.push(...rulee);
    }
    return relationRule;
}


function separate_rules(rules: RuleInterface[]): RuleInterface[][] {
    const grouped_rules: RuleInterface[][] = [];
    let group: RuleInterface[] = [];

    for (const rule of rules) {
        if (group.length === 0) {
            group.push(rule);
        } else {
            let related_to_group = false;
            for (const r of group) {
                if (
                    rule.Node1 === r.Result1 ||
                    rule.Node1 === r.Result1 ||
                    rule.Node2 === r.Result2 ||
                    rule.Node2 === r.Result2
                ) {
                    related_to_group = true;
                    break;
                }
            }

            if (!related_to_group) {
                grouped_rules.push(group);
                group = [rule];
            } else {
                group.push(rule);
            }
        }
    }

    grouped_rules.push(group);

    return grouped_rules;
}

function find_final_conclusions(grouped_rules: RuleInterface[][]): string[] {
    const final_conclusions: string[] = [];

    for (const group of grouped_rules) {
        const known_values: { [key: string]: boolean } = {};
        let final_conclusion = "ไม่มีอาการที่เกี่ยวข้อง";

        while (true) {
            let new_values_added = false;

            for (const rule of group) {
                const premise1 = rule.Node1;
                const premise2 = rule.Node2;
                const operator = rule.Operator?.OperatorName;
                const conclude1 = rule.Result1;
                const conclude2 = rule.Result2;

                if (!(premise1 in known_values) && premise1 !== null) {
                    known_values[premise1] = get_user_input(premise1);
                }

                // if (!(premise2 in known_values) && premise2 ) {
                //     known_values[premise2] = get_user_input(premise2);
                // }
                if (premise2 !== null && !(premise2 in known_values)) {
                    known_values[premise2] = get_user_input(premise2);
                }

                if (premise2 !== null && !(premise2 in known_values)) {
                    continue;
                }

                const value1 = known_values[premise1];
                const value2 = premise2 !== null ? known_values[premise2] : null;

                let result1: boolean;
                let result2: boolean;
                if (operator === "AND") {
                    result1 = value1 && value2!;
                    result2 = value1 && value2!;
                } else if (operator === "OR") {
                    result1 = value1 || value2!;
                    result2 = value1 || value2!;
                } else {
                    result1 = value1;
                    result2 = value1;
                }

                if (
                    (conclude1 in known_values && known_values[conclude1] === result1) &&
                    (conclude2 === null || (conclude2 in known_values && known_values[conclude2] === result2))
                ) {
                    continue;
                }

                known_values[conclude1] = result1;
                if (conclude2 !== null) {
                    known_values[conclude2] = result2;
                }

                new_values_added = true;

                // const all_premises = [premise1] + (premise2 !== null ? [premise2] : []);
                const all_premises = [premise1, ...(premise2 !== null ? [premise2] : [])];
                const all_conclusions = [conclude1, conclude2 !== null ? conclude2 : ""];
                for (const conclusion of all_conclusions) {
                    if (!all_premises.includes(conclusion) && known_values[conclusion]) {
                        final_conclusion = conclusion;
                        break;
                    }
                }
            }

            if (!new_values_added) {
                break;
            }
        }

        final_conclusions.push(final_conclusion);
    }

    return final_conclusions;
}

const rules = get_rules_from_database();
const grouped_rules = separate_rules(rules);
const final_conclusions = find_final_conclusions(grouped_rules);

for (let i = 0; i < final_conclusions.length; i++) {
    console.log(`ผลลัพธ์ที่ ${i + 1} คือ : ${final_conclusions[i]}`);
}
