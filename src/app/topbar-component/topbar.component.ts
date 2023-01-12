import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as jQuery from 'jquery';
import { FileUploader } from 'ng2-file-upload';
import { Project } from '../entity/Project';
import { FileService } from '../service/file.service';
import { ProjectService } from '../service/project.service';
import {CCSLSet} from '../entity/CCSLSet';
import {Router} from '@angular/router';

@Component({
  selector: 'app-topbar-component',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Output() openEvent = new EventEmitter<string[]>();

  userName: string;
  project: Project;
  projectName: string;
  fileList: Array<string> = [];
  ontologyName: string;
  interval;
  interval1;
  ontologyFlag = false;
  scenarioDiagramsFlag = false;
  projects: string[];
  composedCcslSet: CCSLSet;
  version;
  ccslSetList: CCSLSet[];
  ccslFlag = false;
  composedCcslFlag = false;
  CGs: string[] = [];
  CCG: string[] = [];

  uploader: FileUploader = new FileUploader({
    method: 'POST',
    itemAlias: 'xmlFile',
    autoUpload: false,
  });

  constructor(
    private fileService: FileService,
    private projectService: ProjectService,
    private router: Router
  ) {
    // tslint:disable-next-line:triple-equals
    if (document.cookie != '') {
      // this.userName = jQuery.parseJSON(document.cookie)['username']
      // tslint:disable-next-line:triple-equals
      if (document.cookie.indexOf('{') != -1 && document.cookie.indexOf('}') != -1){
        const start = document.cookie.indexOf('{');
        const end = document.cookie.indexOf('}');
        const cookie = document.cookie.slice(start, end + 1);
        // console.log(cookie);
        this.userName = jQuery.parseJSON(cookie).username;
        // console.log(this.userName)
      }
    } else {
      // this.userName = "Not Login"
    }

    projectService.changeProjectEmitted$.subscribe(
      project => {
        this.project = project;
        console.log(this.project);
        this.projectName = project.title;
        if (this.project.ccslSetList != null) {
          this.ccslSetList = this.project.ccslSetList;
          this.ccslFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.CGs.length != this.ccslSetList.length) {
            for (let i = 0; i < this.ccslSetList.length; i++) {
              this.CGs.push('CG-' + (i + 1));
            }
          }
          setTimeout(() => {
            this.change(this.ccslSetList[0].id);
          }, 0);
        }
        if (this.project.composedCcslSet != null) {
          // console.log('hahaha');
          this.composedCcslSet = this.project.composedCcslSet;
          this.composedCcslFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.CCG.length != 1) {
            this.CCG.push('ComposedCG');
          }
        }
      });
  }

  ngOnInit(): void {
  }

  toHomePage(): void {
    this.router.navigate(['/home']);
  }

  newFile(): void {
    document.getElementById('help').style.display = 'none';
    document.getElementById('content-component').style.display = 'block';
    this.fileService.newProject(true);
  }

  uploadFile(): void {
    document.getElementById('help').style.display = 'none';
    document.getElementById('content-component').style.display = 'block';
    this.uploader.clearQueue();
    // 若未创建项目，或当前项目为空项目，提示不能上传用户，否则允许用户上传
    if (this.projectName == null) {
      alert('请在上传 xml 文件之前先创建一个项目！');
    } else {
      document.getElementById('xmlFile').click();
    }
  }

  selectedFileOnChanged(event: any): void {
    // console.log("selectedOWLOnChanged");
    console.log('即将调用upload!');
    // 上传文件
    this.upload();
  }

  // 上传情景图xml文件
  upload(): void {
    if (!this.project) {
      alert('请先创建一个项目！');
    } else {
      this.fileService.setProject(this.projectName).subscribe(
        res => {
          // console.log(res);
          // console.log(this.uploader)
          const that = this;
          that.fileService.uploadFile(that.uploader);
          // tslint:disable-next-line:only-arrow-functions
          that.uploader.onCompleteAll = function(): void {
            // tslint:disable-next-line:no-console
            console.info('onCompleteAll');
            // tslint:disable-next-line:only-arrow-functions
            that.interval = setInterval(function(): void {
              clearInterval(that.interval);
              // 解析xml文件得到情景图对象
              that.fileService.getScenarioDiagrams(that.projectName).subscribe(
                project => {
                  // console.log(project);
                  that.project.contextDiagram = project.contextDiagram;
                  that.project.problemDiagram = project.problemDiagram;
                  that.project.scenarioGraphList = project.scenarioGraphList;
                  that.scenarioDiagramsFlag = true;
                  alert('情景图上传成功！');
                  console.log(that.project);
                  // // 将情景图转换为CCSL约束
                  // that.projectService.sdToCCSL(that.project).subscribe(
                  //   ccsls => {
                  //     // console.log(ccsls);
                  //     that.project.ccslSetList = ccsls;
                  //     console.log(that.project)
                  //     that.projectService.sendProject(that.project);
                  //   })
                });
            }, 1500);
          };
        }
      );
    }
  }

  uploadOntology(): void {
    // 若未创建项目，或当前项目为空项目，提示不能上传用户，否则允许用户上传
    document.getElementById('help').style.display = 'none';
    document.getElementById('content-component').style.display = 'block';
    this.uploader.clearQueue();
    if (this.projectName == null) {
      alert('请在上传 owl 文件之前先创建一个项目！');
    } else {
      document.getElementById('ontologyFile').click();
    }
  }

  // 上传owl文件的隐藏事件
  // 通过点击Ontology-Eontology-Upload，在已创建项目,或当前项目不为空项目的时候触发
  selectedOWLOnChanged(event: any): void {
    const path = event.target.files[0].name;
    this.ontologyName = path.split('.')[0];
    console.log(this.ontologyName);
    // this.projectService.sendProject(this.project);
    console.log('即将调用uploadOWL!');
    // 上传文件
    this.uploadOWL();
  }

  // 上传环境本体owl文件
  uploadOWL(): void {
    if (!this.project) {
      alert('请先创建一个项目！');
    } else {
      this.fileService.setProject(this.projectName).subscribe(
        res => {
          console.log(res);
          // if (res === true) {
          console.log(this.uploader);
          const that = this;
          that.fileService.uploadFile(that.uploader);
          // tslint:disable-next-line:only-arrow-functions
          that.uploader.onCompleteAll = function(): void {
            // tslint:disable-next-line:no-console
              console.info('onCompleteOntology');
            // tslint:disable-next-line:only-arrow-functions
              that.interval = setInterval(function(): void {
                clearInterval(that.interval);
                // 解析owl文件得到环境本体对象
                that.fileService.getOntology(that.ontologyName, that.projectName).subscribe(
                  ontology => {
                    // console.log(ontology);
                    that.project.ontology = ontology;
                    that.ontologyFlag = true;
                    alert('环境本体上传成功！');
                    console.log(that.project);
                    that.projectService.sendProject(that.project);
                  });
              }, 1500);
            };
          // } else {
          //   alert('The project already exists!');
          // }
        }
      );
    }
  }

  saveProject(): void {
    document.getElementById('help').style.display = 'none';
    document.getElementById('content-component').style.display = 'block';
    let result: boolean;
    console.log(this.project);
    if (this.project.title == null) {
      alert('该项目为空！');
      return;
    }
    this.projectName = this.project.title;
    this.fileService.saveProject(this.project).subscribe(
      res => {
        result = res;
        if (!result) {
          alert('保存失败！');
        } else {
          alert('保存成功！');
        }
      }
    );
  }

  openProject(): void {
    document.getElementById('help').style.display = 'none';
    document.getElementById('content-component').style.display = 'block';
    this.fileService.searchProject().subscribe(
      projects => {
        this.projects = projects;
        console.log(this.projects);
        this.openEvent.emit(projects);
      }
    );
  }

  sdToCCSL(): void {
    if (!this.project) {
      alert('请先新建或打开一个项目！');
    } else if (this.project.scenarioGraphList.length <= 0) {
      alert('请先上传情景图！');
    } else {
      this.projectService.sdToCCSL(this.project).subscribe(
        ccsls => {
          console.log(ccsls);
          this.project.ccslSetList = ccsls;
          // console.log(this.project)
          this.projectService.sendProject(this.project);
          console.log(this.project.ccslSetList[0].id);
          setTimeout(() => {
            this.change(this.project.ccslSetList[0].id);
          }, 300);
        });
    }
  }
  // 组合
  CCSLComposition(): void {
    // console.log(this.project);
    if (!this.project) {
      alert('请先新建或打开一个项目！');
    } else if (this.project.ccslSetList == null) {
      alert('请先将顺序图转换为 CCSL 约束!');
    } else {
      console.log(this.projectName);
      this.project.title = this.projectName;
      this.projectService.CCSLComposition(this.project).subscribe(
        ccslConstraints => {
          console.log(ccslConstraints);
          this.project.composedCcslSet = ccslConstraints;
          this.projectService.sendProject(this.project);
          setTimeout(() => {
            this.change(this.composedCcslSet.id);
          }, 300);
        });
    }
  }

  change(title: string): void {
    console.log(title + '-P');
    let parTab;
    if (title.startsWith('Composed')) {
      parTab = document.getElementById('composedCCSL').parentElement;
    } else if (title.startsWith('Simplified')){
      parTab = document.getElementById('simplifiedCCSL').parentElement;
    } else if (title.startsWith('Orchestrated')){
      parTab = document.getElementById('orchestratedCCSL').parentElement;
    } else {
      parTab = document.getElementById(title).parentElement;
    }
    console.log(parTab);
    const tabs = parTab.children;
    console.log(tabs);
    const cgTitle = title.replace('CCSL', 'CG');
    console.log(cgTitle);


    for (let i = 0; i <= tabs.length; i++) {
      // tslint:disable-next-line:triple-equals
      if (tabs[i] != undefined) {
        const ctabs = tabs[i].children;
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < ctabs.length; j++) {
          // console.log(ctabs[j]);
          const id = ctabs[j].getAttribute('id');
          // console.log(id)
          document.getElementById(id + '-P').style.display = 'none';
          const cgId = id.replace('CCSL', 'CG');
          // console.log(cgId)
          document.getElementById(cgId + '-P').style.display = 'none';
          if (this.project.composedCcslSet != null && this.project.composedCcslSet.id != null) {
            document.getElementById('ComposedCCSL-P').style.display = 'none';
            document.getElementById('ComposedCG-P').style.display = 'none';
          }
          if (this.project.simplifiedCcslSet != null && this.project.simplifiedCcslSet.id != null) {
            document.getElementById('SimplifiedCCSL-P').style.display = 'none';
            document.getElementById('SimplifiedCG-P').style.display = 'none';
          }
          if (this.project.orchestrateCcslSet != null && this.project.orchestrateCcslSet.id != null) {
            document.getElementById('OrchestratedCCSL-P').style.display = 'none';
            document.getElementById('OrchestratedCG-P').style.display = 'none';
          }
        }
      }
    }

    // console.log(document.getElementById(title + "-P"))
    document.getElementById(title + '-P').style.display = 'block';
    document.getElementById(cgTitle + '-P').style.display = 'block';

    const time = (new Date()).getTime();
    const userName = this.projectService.getUserName();

    const url = `http://localhost:8071/project/display?projectName=${this.projectName}&fileName=${cgTitle}`;
    console.log(url);
    const ID = cgTitle + '-Pag';
    console.log(ID);
    console.log(document.getElementById(ID));
    // console.log($(ID));
    // $(ID).attr("src", url);
    document.getElementById(ID).setAttribute('src', url);

    document.getElementById('ccslText').innerHTML = 'CCSL 约束:';
    document.getElementById('cgsText').innerHTML = '时钟图:';
    const ccslText = document.getElementById('ccslText').innerHTML;
    let newCcslText = null;
    if (title.startsWith('CCSL')) {
      newCcslText = '情景图 ' + title.split('CCSL-')[1] + ' 的 ' + ccslText.slice(0, 16);
    } else if (title.startsWith('Composed')) {
      newCcslText = '合并后的 ' + ccslText;
    } else if (title.startsWith('Simplified')){
      newCcslText = '简化后的 ' + ccslText;
    } else if (title.startsWith('Orchestrated')){
      newCcslText = '编排后的 ' + ccslText;
    }
    console.log(newCcslText);
    document.getElementById('ccslText').innerHTML = newCcslText;
    const cgsText = document.getElementById('cgsText').innerHTML;
    let newCgsText = null;
    if (title.startsWith('CCSL')) {
      newCgsText = cgsText.slice(0, 3) + ' ' + title.split('CCSL-')[1] + cgsText.slice(3, 4);
    } else if (title.startsWith('Composed')) {
      newCgsText = '合并后的 ' + cgsText;
    } else if (title.startsWith('Simplified')){
      newCgsText = '简化后的 ' + cgsText;
    } else if (title.startsWith('Orchestrated')){
      newCgsText = '编排后的 ' + cgsText;
    }
    console.log(newCgsText);
    document.getElementById('cgsText').innerHTML = newCgsText;
  }

  help(): void {
    console.log('help');
    console.log(document.getElementById('content-component'));
    document.getElementById('content-component').style.display = 'none';
    document.getElementById('help').style.display = 'block';
  }
}
