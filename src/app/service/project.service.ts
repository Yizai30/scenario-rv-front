import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { CCSLSet } from '../entity/CCSLSet';
import { Project } from '../entity/Project';
import * as jQuery from 'jquery';
import { FileService } from './file.service';
import { VisualizedScenario } from '../entity/VisualizedScenario';
import {CirculateConsistentRes} from '../entity/CirculateConsistentRes';
import {SMTRes} from '../entity/SMTRes';
import {SMTCheckRequest} from '../entity/SMTCheckRequest';
import {SMTCheckRes} from '../entity/SMTCheckRes';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient,
    private fileService: FileService,
  ) {
    this.project = new Project();
  }

  project: Project;
  projectName: string;
  version: string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private SMTEmit = new Subject<any>();
  private emitChangeProject = new Subject<any>();
	changeProjectEmitted$ = this.emitChangeProject.asObservable();

  initProject(title) {
    console.log(title);
    this.project.title = title;
    this.sendProject(this.project);
  }
	sendProject(change: Project) {
		this.emitChangeProject.next(change);
	}

  getProject(projectName: string, version): void {
    // var that = this;
    this.projectName = projectName;
    if (version === undefined) {
      version = 'undefined';
    }
    this.version = version;
    this.fileService.getProject(projectName, version).subscribe(
      project => {
        console.log('getProject:' + project);
        this.sendProject(project);
        if (project){
          alert('打开成功！');
        } else{
          alert('打开失败！');
        }
        if (project.smtRes) {
          document.getElementById('smtResName').innerText = project.smtRes.name;
          document.getElementById('smt-res-result').innerText = project.smtRes.res;
          document.getElementById('smtResName').style.display = 'block';
        }
      });
  }

  sdToCCSL(project: Project): Observable<CCSLSet[]> {
    const url = `http://localhost:8071/project/sdToCCSL`;
    const ccsls = this.http.post<CCSLSet[]>(url, project, this.httpOptions);
    return ccsls;
  }

  CCSLComposition(project: Project): Observable<CCSLSet> {
    const username = this.getUserName();
    const url = `http://localhost:8071/project/CCSLComposition`;
    const ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  CCSLSimplify(project: Project): Observable<CCSLSet> {
    const url = `http://localhost:8071/project/CCSLSimplify`;
    const ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  CCSLOrchestrate(project: Project): Observable<CCSLSet> {
    const url = `http://localhost:8071/project/CCSLOrchestrate`;
    const ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  LocateInconsistency(project: Project): Observable<string[]> {
    const url = `http://localhost:8071/project/InconsistentLocate`;
    const sdPngNameList = this.http.post<string[]>(url, project, this.httpOptions);
    return sdPngNameList;
  }

  getCirculateConsistent(project: Project): Observable<CirculateConsistentRes[]> {
    const url = `http://localhost:8071/check/getConsistent`;
    const circulateConsistentResList = this.http.post<CirculateConsistentRes[]>(url, project, this.httpOptions);
    return circulateConsistentResList;
  }

  smtCheck(project: Project, timeout: number, bound: number, period: boolean, pv: number, deadlock: boolean): Observable<SMTRes> {
    const url = `http://localhost:8071/check/smt`;
    const sMTCheckRequest = new SMTCheckRequest(project, timeout, bound, period, pv, deadlock);
    // console.log(url);
    const res = this.http.post<SMTRes>(url, sMTCheckRequest, this.httpOptions);
    return res;
  }

  minUnsat(project: Project): Observable<SMTCheckRes> {
    const url = `http://localhost:8071/check/minUnsat`;
    const smtCheckRes = this.http.post<SMTCheckRes>(url, project, this.httpOptions);
    return smtCheckRes;
  }

  setSMTRes(SMTRes: SMTRes[]) {
    this.SMTEmit.next(SMTRes);
  }

  visualizeScenario(project: Project): Observable<VisualizedScenario> {
    const url = `http://localhost:8071/project/visualizeScenario`;
    const visualizedScenario = this.http.post<VisualizedScenario>(url, project, this.httpOptions);
    return visualizedScenario;
  }

  getUserName() {
    let username = '';
    if (document.cookie != null && document.cookie != '') {
      // username = JSON.parse(document.cookie)['username'];
      if (document.cookie.indexOf('{') != -1 && document.cookie.indexOf('}') != -1){
        const start = document.cookie.indexOf('{');
        const end = document.cookie.indexOf('}');
        const cookie = document.cookie.slice(start, end + 1);
        // console.log(cookie);
        username = jQuery.parseJSON(cookie).username;
        // console.log(username)
      }

    }
    return username ? username : 'test';
  }
}
