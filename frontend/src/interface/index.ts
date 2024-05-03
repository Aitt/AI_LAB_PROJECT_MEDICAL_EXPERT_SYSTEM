import { Admin } from "./Auth";

export interface Knowledge {
    ID:      number;
    Title:   string;
    Admin?:   Admin;
    AdminID:  number;
    State:   string;
}

export interface RuleInterface {
    editRuleId: any;
    push(Node1: string): unknown;
    ID:    number;
    Node1: string;
    Node2: string;
    Result1: string;
    Result2: string;
    // OperatorNamme : OperatorInterface;
    OperatorID:     number;
    KnowledgeID:    number;
    Operator?:       OperatorInterface;
    Knowledge:  Knowledge;
    KnowledgeTitle?: string;
}

export interface OperatorInterface {
    ID:             number;
    OperatorName:   string;
}

export interface Fact {
    ID:         number;
    FactName:   string;
    Description: string;
    KnowledgeID:    number;
    Knowledge:  Knowledge;
    StateFact: string;
}