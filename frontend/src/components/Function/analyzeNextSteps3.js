
// import { message } from "antd";
// import { Knowledge, RuleInterface } from "../../interface";
// import { ResponseBotObject } from "../Chatbot/Chatbot1";
// import { Rule } from "@mui/icons-material";
// let userResponseAnswer: string[] = [];
// let userAnswers: { [key: string]: boolean } = {}; // เพิ่มตัวแปรสำหรับเก็บคำตอบของผู้ใช้
// let StartingNodesArray: string[] = [];

// export const analyzeNextSteps1 = (
//   step: number,
//   userResponse: string,
//   dataKnowledge: Knowledge[],
//   dataRules: RuleInterface[],
//   setBotResponse: (response: ResponseBotObject) => void 
// ) => {
//   let RelationOfRule: string[] = [];
//   let StartingNodesArray: string[] = [];

 
//   const findStartingNodesOfKnowledge = (dataRules: RuleInterface[]) => {
//     const startingNodes: string[] = [];
//     for (const rule of dataRules) {
//       if (rule.Node1 && rule.Node2) {
//         if (!userResponseAnswer.includes(rule.Node1) && !userResponseAnswer.includes(rule.Node2)) {
//           startingNodes.push(rule.Node1, rule.Node2);
//         }
//       } else if (rule.Node1) {
//         if (!userResponseAnswer.includes(rule.Node1)) {
//           startingNodes.push(rule.Node1);
//         }
//       } else if (rule.Node2) {
//         if (!userResponseAnswer.includes(rule.Node2)) {
//           startingNodes.push(rule.Node2);
//         }
//       }
//     }
//     return startingNodes;
//   };

//   console.log("Step:", step);
  
//   const startingNodes = findStartingNodesOfKnowledge(dataRules);
//   StartingNodesArray = [...startingNodes];
//   console.log("Starting Nodes Array:", StartingNodesArray); // เพิ่ม console.log เพื่อแสดง StartingNodesArray

 
// function get_user_input(premise: string): boolean {
//   const user_input = prompt(`Is ${premise} true or false? (True/False): `)?.toLowerCase();
//   return user_input === "true";
// }
//   interface Rule {
//     premise1: string;
//     premise2: string | null;
//     operator: string | null;
//     conclude1: string;
//     conclude2: string | null;
//   }

//   function separate_rules(rules: Rule[]): Rule[][] {
//     const grouped_rules: Rule[][] = [];
//     let group: Rule[] = [];

//     for (const rule of rules) {
//       // เริ่มกลุ่มใหม่หากพบกฏที่ไม่มีความเกี่ยวข้องกับกลุ่มก่อนหน้า
//       if (group.length === 0) {
//           group.push(rule);
//       } else {
//           // ตรวจสอบว่ากฏใหม่มีตัวแปรที่เชื่อมโยงกับกฏในกลุ่มหรือไม่
//           let related_to_group = false;
//           for (const r of group) {
//               if (
//                   rule.premise1 === r.conclude1 ||
//                   rule.premise1 === r.conclude2 ||
//                   rule.premise2 === r.conclude1 ||
//                   rule.premise2 === r.conclude2
//               ) {
//                   related_to_group = true;
//                   break;
//               }
//           }

//           // ถ้ากฏใหม่ไม่เกี่ยวข้องกับกฏในกลุ่ม ให้ปิดกลุ่มเดิมและสร้างกลุ่มใหม่
//           if (!related_to_group) {
//               grouped_rules.push(group);
//               group = [rule];
//           } else {
//               group.push(rule);
//           }
//       }
//     }

//     // เพิ่มกลุ่มสุดท้ายที่เหลือ
//     grouped_rules.push(group);
//     return grouped_rules;
//   }

//   function find_final_conclusions(grouped_rules: Rule[][]): string[] {
//     const final_conclusions: string[] = [];

//     for (const group of grouped_rules) {
      
//         const known_values: { [key: string]: boolean } = {};
//         // let final_conclusion_for_group: string | null = null;

//         while (true) {
//             let new_values_added = false;

//             for (const rule of group) {
//                 const premise1 = rule.premise1;
//                 const premise2 = rule.premise2;
//                 const operator = rule.operator;
//                 const conclude1 = rule.conclude1;
//                 const conclude2 = rule.conclude2;

//                 // ตรวจสอบ Premise และ Conclude ที่มีค่าและไม่ใช่ None
//                 if (!(premise1 in known_values) && premise1 !== null) {
//                     known_values[premise1] = get_user_input(premise1);
//                 }

//                 if (premise2 !== null && !(premise2 in known_values)) {
//                     known_values[premise2] = get_user_input(premise2);
//                 }

//                 // ข้ามกฎนี้หากเงื่อนไขต้นที่สองยังไม่มีค่า
//                 if (premise2 && !(premise2 in known_values)) {
//                     continue;
//                 }

//                 const value1 = known_values[premise1];
//                 const value2 = premise2 ? known_values[premise2] : undefined;

//                 let result1;
//                 let result2;

//                 if (operator === "1") {   // 1 = AND
//                     result1 = value1 && value2!;
//                     result2 = value1 && value2!;
//                 } else if (operator === "2") {  //  2 = OR
//                     result1 = value1 || value2!;
//                     result2 = value1 || value2!;
//                 } else {
//                     result1 = value1;
//                     result2 = value1;
//                 }

//                 // ข้ามกฎนี้หากผลสรุปทั้งสองมีค่าอยู่แล้ว
//                 if (
//                     (conclude1 in known_values && known_values[conclude1] === result1) &&
//                     (conclude2 === null || (conclude2 in known_values && known_values[conclude2] === result2))
//                 ) {
//                     continue;
//                 }

//                 known_values[conclude1] = result1;
//                 if (conclude2 !== null) {
//                     known_values[conclude2] = result2!;
//                 }

//                 new_values_added = true;
//             }

//             // หยุดวนลูปหากไม่มีกฎใหม่ที่สามารถนำมาใช้ได้อีก
//             if (!new_values_added) {
//                 break;
//             }
//         }
//         // ตรวจสอบว่ากฎนี้มีคำตอบสุดท้ายหรือไม่
//         const all_conclusions = group.flatMap(rule => [rule.conclude1, ...(rule.conclude2 ? [rule.conclude2] : [])]);
//         const final_conclusion_for_group = all_conclusions.find(conclusion => !group.some(rule => [rule.premise1, rule.premise2].includes(conclusion)) && known_values[conclusion]);

//         if (final_conclusion_for_group) {
//             final_conclusions.push(final_conclusion_for_group);
//         } else {
//             final_conclusions.push("ไม่มีคำตอบ");
//         }
//     }

//     return final_conclusions;
// }

//   // const rules: Rule[] = dataRules.map(rule => {
//   //   const operator = rule.OperatorID != null ? rule.OperatorID.toString() : null;
//   //   console.log("Operator:", operator); // เพิ่มบรรทัดนี้เพื่อ console.log ค่า operator ในแต่ละรอบของลูป map
//   //   return {
//   //     premise1: rule.Node1,
//   //     premise2: rule.Node2 || null,
//   //     operator: operator,
//   //     conclude1: rule.Result1,
//   //     conclude2: rule.Result2 || null,
//   //   };
//   // });


// //   const filterKnowledge = (dataRules: RuleInterface[], userResponseAnswer: string[]) => {
// //     const filteredKnowledge: RuleInterface[] = [];
// //     for (const rule of dataRules) {
// //         if (userResponseAnswer[2] === rule.KnowledgeTitle) {
// //             filteredKnowledge.push(rule);
// //         }
// //     }
// //     return filteredKnowledge;
// // };

// // const filteredKnowledge = filterKnowledge(dataRules, userResponseAnswer);
// // const rules: Rule[] = filteredKnowledge.map(rule => {
// //     const operator = rule.OperatorID != null ? rule.OperatorID.toString() : null;
// //     return {
// //         premise1: rule.Node1,
// //         premise2: rule.Node2 || null,
// //         operator: operator,
// //         conclude1: rule.Result1,
// //         conclude2: rule.Result2 || null,
// //     };
// // });

  
// const rules: Rule[] = dataRules
//   .filter(rule => userResponseAnswer[2] === rule.KnowledgeTitle)
//   .map(rule => {
//     const operator = rule.OperatorID != null ? rule.OperatorID.toString() : null;
//     return {
//       premise1: rule.Node1,
//       premise2: rule.Node2 || null,
//       operator: operator,
//       conclude1: rule.Result1,
//       conclude2: rule.Result2 || null,
//     };
//   });

  
//   const relationOfRule = (dataRules: RuleInterface[]) => {
//     const relationRule: any[] = [];
//     for (const rule of dataRules) {
//       if (userResponseAnswer[1] === rule.KnowledgeTitle) {
//         const rulee = [];
//         rulee.push(rule.Node1 || "");
//         rulee.push(rule.Operator?.OperatorName);
//         rulee.push(rule.Node2 || "");
//         rulee.push(rule.Result1 || "");
//         rulee.push(rule.Result2 || "");
//         relationRule.push(...rulee);
//       }
//     }
//     console.log("Relation of Rule:", relationRule); // เพิ่ม console.log เพื่อแสดง relationRule
//     return relationRule;
//   };
// // const rules: Rule[] = [
// //   { premise1: "A", premise2: "B", operator: "and", conclude1: "G", conclude2: null },
// //   { premise1: "G", premise2: "F", operator: "and", conclude1: "J", conclude2: null },
// //   { premise1: "J", premise2: null, operator: null, conclude1: "X", conclude2: null },
// //   { premise1: "C", premise2: "D", operator: "and", conclude1: "H", conclude2: null },
// //   { premise1: "E", premise2: null, operator: null, conclude1: "I", conclude2: null },
// //   { premise1: "H", premise2: "I", operator: "and", conclude1: "K", conclude2: null },
// //   { premise1: "K", premise2: null, operator: null, conclude1: "Y", conclude2: null },
// // ];

//   const grouped_rules = separate_rules(rules);
//   const final_conclusions = find_final_conclusions(grouped_rules);
//   console.log("Final Conclusions:", final_conclusions); // เพิ่ม console.log เพื่อแสดง final_conclusions

//   userResponseAnswer.push(userResponse); 

//   if (step === 0) {
//     return {
//       purpose: "specify 2",
//       message: `ยินดีที่ได้รู้จักครับบบ, คุณ ${userResponse} อยากจะสอบถามหรือมีข้อสงสยด้านใด?`,
//       options: dataKnowledge.map((knowledge) => `${knowledge.Title}`),
//     };
//   } else if (step === 1) {
//     return {
//       purpose: "specify 3",
//       message: `คุณได้เลือกรายการ ${userResponse} `,
//       options: ["ยืนยัน", "ออกจากการสนทนา"],
//     };
//   }
  
//   for (let i = 0; i < StartingNodesArray.length; i++) {
//     if (step === i + 2) {
//       return {
//         purpose: `คำถาม`,
//         message: `คุณมีอาการ "${StartingNodesArray[i]}" ใช่หรือไม่?\n`,
//         options: ["true", "false"],
//       };
//     } else if (step > i + 2) {
//       // เก็บคำตอบของผู้ใช้ลงใน userAnswers
//       userAnswers[StartingNodesArray[i]] = userResponse === "true";
//       console.log(`userAnswer : ${userAnswers}` )
//     }
//   }

//   return {
//     purpose: "RESULT",
//     message: `ผลลัพธ์ของคุณคือ : ${final_conclusions.join(', ')}`,
//   };
// };
