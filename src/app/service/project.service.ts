import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { CCSLSet } from '../entity/CCSLSet';
import { Project } from '../entity/Project';
import * as jQuery from 'jquery';
import { FileService } from './file.service';
import { VisualizedScenario } from '../entity/VisualizedScenario';

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
        console.log(project);
        this.sendProject(project);
        if (project){
          alert('打开成功！');
        } else{
          alert('打开失败！');
        }
      });
  }

  sdToCCSL(project: Project): Observable<CCSLSet[]> {
    const username = this.getUserName();
    const url = `http://localhost:8071/project/sdToCCSL?username=${username}`;
    const ccsls = this.http.post<CCSLSet[]>(url, project, this.httpOptions);
    return ccsls;
  }

  CCSLComposition(project: Project): Observable<CCSLSet> {
    const username = this.getUserName();
    const url = `http://localhost:8071/project/CCSLComposition?username=${username}`;
    const ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  CCSLSimplify(project: Project): Observable<CCSLSet> {
    const username = this.getUserName();
    const url = `http://localhost:8071/project/CCSLSimplify?username=${username}`;
    const ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  CCSLOrchestrate(project: Project): Observable<CCSLSet> {
    const username = this.getUserName();
    const url = `http://localhost:8071/project/CCSLOrchestrate?username=${username}`;
    const ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  LocateInconsistency(project: Project): Observable<CCSLSet> {
    const url = `http://localhost:8071/project/InconsistentLocate`;
    const ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  visualizeScenario(project: Project): Observable<VisualizedScenario> {
    const username = this.getUserName();
    const url = `http://localhost:8071/project/visualizeScenario?username=${username}`;
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
