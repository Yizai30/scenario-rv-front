import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import * as jQuery from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { Ontology } from '../entity/Ontology';
import { Project } from '../entity/Project';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient,
  ) { }

  projectName: string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private newProEmit = new Subject<any>();
  newProEmmited$ = this.newProEmit.asObservable();

  private sendVersionEmit = new Subject<any>();
  sendVersionEmmited$ = this.sendVersionEmit.asObservable();
  newProject(isnew: boolean) {
    this.newProEmit.next(isnew);
  }
  sendVersion(version) {
    this.sendVersionEmit.next(version);
  }

  searchVersion(project: string): Observable<string[]> {
    const url = `http://localhost:8071/file/searchVersion/${project}`;
    return this.http.get<string[]>(url);
  }

  searchProject(): Observable<string[]> {
    const username = this.getUserName();
    console.log(username);
    const url = `http://localhost:8071/file/searchProject?username=${username}`;
    return this.http.get<string[]>(url);
  }

  setProject(projectName: string): Observable<any> {
    this.projectName = projectName;
    const url = `http://localhost:8071/file/setProject/${projectName}`;
    const res = this.http.post<any>(url, this.httpOptions);
    // console.log(url);
    return res;
  }

  // 上传文件
  uploadFile(uploader: FileUploader): void {
    const url = `http://localhost:8071/file/upload/${this.projectName}`;
    uploader.setOptions({ url });
    uploader.uploadAll();
    console.log(url);
  }

  getScenarioDiagrams(projectName: string): Observable<Project> {
    const url = `http://localhost:8071/file/getScenarioDiagrams/${projectName}`;
    // console.log(url)
    return this.http.get<Project>(url);
  }

  getOntology(fileName: string, projectName: string): Observable<Ontology> {
    const url = `http://localhost:8071/file/getOntology/${projectName}/${fileName}`;
    // console.log(url)
    return this.http.get<Ontology>(url);
  }

  // 保存项目
  saveProject(project: Project): Observable<boolean> {
    // console.log(project)
    const url = `http://localhost:8071/file/saveProject`;
    // console.log(url)
    console.log('saveProject: ' + project);
    const res = this.http.post<boolean>(url, project, this.httpOptions);
    return res;
  }

  // 读取项目信息
  getProject(projectName: string, ver): Observable<Project> {
    const url = `http://localhost:8071/file/getProject/${projectName}/${ver}`;
    console.log(url);
    const res = this.http.get<Project>(url);
    return res;
  }

  getUserName() {
    let username = '';
    if (document.cookie != null && document.cookie != '') {
      // username = jQuery.parseJSON(document.cookie)['username'];
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
