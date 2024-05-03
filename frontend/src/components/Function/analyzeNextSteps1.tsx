
import { message } from "antd";
import { Knowledge, RuleInterface } from "../../interface";
import { ResponseBotObject } from "../Chatbot/Chatbot1";
import { Rule } from "@mui/icons-material";
let userResponseAnswer: string[] = [];
let StartingNodesArray: string[] = [];
let questionsArray : string[]=[]; 
export const analyzeNextSteps1 = (
  step: number,
  userResponse: string,
  dataKnowledge: Knowledge[],
  dataRules: RuleInterface[],
  setBotResponse: (response: ResponseBotObject) => void 
) => {

  const findStartingNodesOfKnowledge = (
    dataRules: RuleInterface[]
  ) => {
    const startingNodes: any[] = [];
    for (const rule of dataRules) {
      if(userResponseAnswer[1]=== rule.KnowledgeTitle){
        if (rule.Node1 && !startingNodes.includes(rule.Node1)) {
          startingNodes.push(rule.Node1);
        }
        if (rule.Node2 && !startingNodes.includes(rule.Node2)) {
          startingNodes.push(rule.Node2);
        }
      }
    }
    return startingNodes;
  };

  const startingNodes = findStartingNodesOfKnowledge(dataRules);
  StartingNodesArray = [...startingNodes];
  console.log("Starting Nodes Array:", StartingNodesArray);

  console.log("Step:", step);

  interface Rule {
    premise1: string;
    premise2: string | null;
    operator: string | null;
    conclude1: string;
    conclude2: string | null;
  }

  const rules: Rule[] = dataRules
    .filter(rule => userResponseAnswer[1] === rule.KnowledgeTitle)
    .map(rule => {
      const operator = rule.OperatorID != null ? rule.OperatorID.toString() : null;
      return {
        premise1: rule.Node1,
        premise2: rule.Node2 || null,
        operator: operator,
        conclude1: rule.Result1,
        conclude2: rule.Result2 || null,
      };
    });

  let i: number = 3; 
  function get_user_input(premise: string): boolean {
      const user_input = userResponseAnswer[i];
      // console.log(`คุณมีอาการ ${premise} หรือไม่? (True/False):`, user_input);
      i++;
      return user_input === "true";
  }
  
 

  function separate_rules(rules: Rule[]): Rule[][] {
    const grouped_rules: Rule[][] = [];
    let group: Rule[] = [];

    for (const rule of rules) {
      if (group.length === 0) {
        group.push(rule);
      } else {
        let related_to_group = false;
        for (const r of group) {
          if (
            rule.premise1 === r.conclude1 ||
            rule.premise1 === r.conclude2 ||
            rule.premise2 === r.conclude1 ||
            rule.premise2 === r.conclude2
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

  function find_final_conclusions(grouped_rules: Rule[][]): { questions: string[], finalConclusions: string[] } {
    const final_conclusions: string[] = [];
    const questions: string[] = [];

    for (const group of grouped_rules) {
      const known_values: { [key: string]: boolean } = {};

      for (const rule of group) {
        const premise1 = rule.premise1;
        const premise2 = rule.premise2;
        const operator = rule.operator;
        const conclude1 = rule.conclude1;
        const conclude2 = rule.conclude2;

        if (!(premise1 in known_values) && premise1 !== null) {
          const userResponse = get_user_input(premise1);
          questions.push(`คุณมีอาการ "${premise1}" ใช่หรือไม่?`);
          // console.log(`QUEST PREMISE1 : ${questions}`)
          known_values[premise1] = userResponse;
        }

        if (premise2 !== null && !(premise2 in known_values)) {
          const userResponse = get_user_input(premise2);
          questions.push(`คุณมีอาการ "${premise2}" ใช่หรือไม่?`);
          // console.log(`QUEST PREMISE2 : ${questions}`)
          known_values[premise2] = userResponse;
        }

        const value1 = known_values[premise1];
        const value2 = premise2 ? known_values[premise2] : undefined;

        let result1;
        let result2;

        if (operator === "1") {
          result1 = value1 && value2!;
          result2 = value1 && value2!;
        } else if (operator === "2") {
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
          known_values[conclude2] = result2!;
        }
      }
      
      const all_conclusions = group.flatMap(rule => [rule.conclude1, ...(rule.conclude2 ? [rule.conclude2] : [])]);
      const final_conclusion_for_group = all_conclusions.find(conclusion => !group.some(rule => [rule.premise1, rule.premise2].includes(conclusion)) && known_values[conclusion]);

      if (final_conclusion_for_group) {
        final_conclusions.push(final_conclusion_for_group);
      } else {
        final_conclusions.push("");
      }
    }
    return { questions, finalConclusions: final_conclusions };
  }

  userResponseAnswer.push(userResponse); 

  const grouped_rules = separate_rules(rules);
  const { questions, finalConclusions } = find_final_conclusions(grouped_rules);
   questionsArray = [...questions]

  

  if (step === 0) {
      return {
        purpose: "specify 2",
        message: `ยินดีที่ได้รู้จักครับบบ, คุณ ${userResponse} อยากจะสอบถามหรือมีข้อสงสยด้านใด?`,
        options: dataKnowledge.map((knowledge) => `${knowledge.Title}`),
      };
    } else if (step === 1) {
      return {
        purpose: "specify 3",
        message: `คุณได้เลือกรายการ ${userResponse} `,
        options: ["ยืนยัน", "ออกจากการสนทนา"],
      };
    }
 
      if (step ===  2) {
        return {
          purpose: `คำถาม`,
          message: `คุณมีอาการ "${StartingNodesArray[0]}" ใช่หรือไม่?\n`,
          options: ["true", "false"],
        };
      } 
 
      for (let i = 1; i < questionsArray.length; i++){
        if (step=== i + 2) {
        console.log(`questionsArray : ${questions}`)
      return {
        purpose: "QUESTION",
        message:  questions[i],
        options: ["true", "false"],
      };
    }
    if(i===questionsArray.length-1){
      return {
        purpose: "RESULT",
        message: `ผลลัพธ์ของคุณคือ : ${finalConclusions.join(', ')}`,
        options: ["เลือกหัวข้อใหม่"],
      };
    }
    if(userResponse==="เลือกหัวข้อใหม่"){
      return {
        purpose: "",
        message: `อยากจะสอบถามหรือมีข้อสงสยด้านใดครับผม??`,
        options: ["ยืนยันสำหรับการเลือกหังข้อใหม่"],
      };
  }
   
  } 
}
  


 
