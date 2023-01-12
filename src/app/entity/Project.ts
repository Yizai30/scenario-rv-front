import { CCSLSet } from './CCSLSet';
import { ContextDiagram } from './ContextDiagram';
import { Ontology } from './Ontology';
import { ProblemDiagram } from './ProblemDiagram';
import { ScenarioGraph } from './ScenarioGraph';
import {CirculateConsistentRes} from './CirculateConsistentRes';
import {SMTRes} from './SMTRes';
import {SMTCheckRes} from './SMTCheckRes';

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
    causalityCcslSet: CCSLSet;
    circularDependencyCcslSet: CCSLSet;
    circularInconsistentLocateCcslSet: CCSLSet;
    smtInconsistentLocateCcslSet: CCSLSet;
    inconsistentLocateSdPngNameList: string[];
    causalityCGName: string;
    circulateConsistentResList: CirculateConsistentRes[];
    smtRes: SMTRes;
    smtCheckRes: SMTCheckRes;
}
