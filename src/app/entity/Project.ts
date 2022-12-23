import { CCSLSet } from "./CCSLSet";
import { ContextDiagram } from "./ContextDiagram";
import { Ontology } from "./Ontology";
import { ProblemDiagram } from "./ProblemDiagram";
import { ScenarioGraph } from "./ScenarioGraph";

export class Project {
    title: string;
    ontology: Ontology;
    contextDiagram: ContextDiagram;
    problemDiagram: ProblemDiagram;
    scenarioGraphList: ScenarioGraph[];
    ccslSetList: CCSLSet[];
    composedCcslSet: CCSLSet;
    simplifiedCcslSet: CCSLSet;
    orchestrateCcslSet: CCSLSet;
    inconsistentLocateCcslSet: CCSLSet;
    causalityCcslSet: CCSLSet;
    circularDependencyCcslSet: CCSLSet;
    circularInconsistentLocateCcslSet: CCSLSet;
    smtInconsistentLocateCcslSet: CCSLSet;

    init(title) {
        this.title = title;
    }
}
