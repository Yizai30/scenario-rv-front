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

  projectName: string;

  constructor(
    private http: HttpClient,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private newProEmit = new Subject<any>();
  newProEmmited$ = this.newProEmit.asObservable();
  newProject(isnew: boolean) {
    this.newProEmit.next(isnew);
  }

  private sendVersionEmit = new Subject<any>();
  sendVersionEmmited$ = this.sendVersionEmit.asObservable();
  sendVersion(version) {
    this.sendVersionEmit.next(version);
  }
  
  searchVersion(project: string): Observable<string[]> {
    let username = this.getUserName()
    const url = `http://47.52.116.116:8071/file/searchVersion/${project}?username=${username}`;
    return this.http.get<string[]>(url);
  }

  searchProject(): Observable<string[]> {
    let username = this.getUserName()
    console.log(username)
    const url = `http://47.52.116.116:8071/file/searchProject?username=${username}`;
    return this.http.get<string[]>(url);
  }

  setProject(projectName: string): Observable<any> {
    let username = this.getUserName()
    this.projectName = projectName;
    const url = `http://47.52.116.116:8071/file/setProject/${projectName}?username=${username}`;
    var res = this.http.post<any>(url, this.httpOptions);
    // console.log(url);
    return res;
  }

  //上传文件
  uploadFile(uploader: FileUploader) {
    let username = this.getUserName()
    let url = `http://47.52.116.116:8071/file/upload/${this.projectName}?username=${username}`
    uploader.setOptions({ url: url });
    uploader.uploadAll();
    console.log(url);
  }

  getScenarioDiagrams(): Observable<Project> {
    let username = this.getUserName()
    const url = `http://47.52.116.116:8071/file/getScenarioDiagrams/?username=${username}`;
    // console.log(url)
    return this.http.get<Project>(url);
  }

  getOntology(fileName: string): Observable<Ontology> {
    let username = this.getUserName()
    const url = `http://47.52.116.116:8071/file/getOntology/${fileName}/?username=${username}`;
    // console.log(url)
    return this.http.get<Ontology>(url);
  }
  
  //保存项目
  saveProject(projectName: string, project: Project): Observable<boolean> {
    let username = this.getUserName()
    // console.log(project)
    const url = `http://47.52.116.116:8071/file/saveProject/${projectName}?username=${username}`;
    // console.log(url)
    var res = this.http.post<boolean>(url, project, this.httpOptions);
    return res;
  }

  //读取项目信息
  getProject(projectName: string, ver): Observable<Project> {
    let username = this.getUserName()
    const url = `http://47.52.116.116:8071/file/getProject/${projectName}/${ver}?username=${username}`;
    console.log(url)
    let res = this.http.get<Project>(url);
    return res;
  }
  
  getUserName() {
    let username = ""
    // document.cookie的读取存在问题
    if (document.cookie != null && document.cookie != "") {
      // username = jQuery.parseJSON(document.cookie)['username'];
      console.log("file username:" + document.cookie['username'])
      username = document.cookie['username'];
    }
    return username ? username : "test"
  }
}
