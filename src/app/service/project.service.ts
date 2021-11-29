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

  project: Project;
  projectName: string;
  version: string;

  constructor(
    private http: HttpClient,
    private fileService: FileService,
  ) {
    this.project = new Project();
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  initProject(title) {
    console.log(title);
    this.project.title = title;
    this.sendProject(this.project);
  }

  private emitChangeProject = new Subject<any>();
	changeProjectEmitted$ = this.emitChangeProject.asObservable();
	sendProject(change: Project) {
		this.emitChangeProject.next(change);
	}

  getProject(projectName: string, version): void {
    // var that = this;
    this.projectName = projectName;
    if (version == undefined)
      version = "undefined";
    this.version = version;
    this.fileService.getProject(projectName, version).subscribe(
      project => {
        console.log(project);
        this.sendProject(project);
        if(project){
          alert("Open successfully!");
        } else{
          alert("Open failed!");
        }
      })
  }

  sdToCCSL(project: Project): Observable<CCSLSet[]> {
    let username = this.getUserName()
    const url = `http://localhost:8071/project/sdToCCSL?username=${username}`;
    var ccsls = this.http.post<CCSLSet[]>(url, project, this.httpOptions);
    return ccsls;
  }

  CCSLComposition(project: Project): Observable<CCSLSet> {
    let username = this.getUserName()
    const url = `http://localhost:8071/project/CCSLComposition?username=${username}`;
    var ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  CCSLSimplify(project: Project): Observable<CCSLSet> {
    let username = this.getUserName()
    const url = `http://localhost:8071/project/CCSLSimplify?username=${username}`;
    var ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  CCSLOrchestrate(project: Project): Observable<CCSLSet> {
    let username = this.getUserName()
    const url = `http://localhost:8071/project/CCSLOrchestrate?username=${username}`;
    var ccsl = this.http.post<CCSLSet>(url, project, this.httpOptions);
    return ccsl;
  }

  visualizeScenario(project: Project): Observable<VisualizedScenario> {
    let username = this.getUserName()
    const url = `http://localhost:8071/project/visualizeScenario?username=${username}`;
    var visualizedScenario = this.http.post<VisualizedScenario>(url, project, this.httpOptions);
    return visualizedScenario;
  }

  getUserName() {
    let username = ""
    if (document.cookie != null && document.cookie != "") {
      username = jQuery.parseJSON(document.cookie)['username'];
    }
    return username ? username : "test"
  }
}
