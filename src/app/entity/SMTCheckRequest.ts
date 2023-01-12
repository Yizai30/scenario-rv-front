import {Project} from './Project';

export class SMTCheckRequest {
  project: Project;
  timeout: number;
  bound: number;
  period: boolean;
  pv: number;
  deadlock: boolean;
  constructor(project: Project, timeout: number, bound: number, period: boolean, pv: number, deadlock: boolean) {
    this.project = project;
    this.timeout = timeout;
    this.bound = bound;
    this.period = period;
    this.pv = pv;
    this.deadlock = deadlock;
  }
}
