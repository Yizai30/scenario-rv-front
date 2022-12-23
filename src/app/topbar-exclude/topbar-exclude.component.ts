import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Project} from '../entity/Project';
import {CCSLSet} from '../entity/CCSLSet';
import {FileUploader} from 'ng2-file-upload';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';
import {Router} from '@angular/router';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-topbar-exclude',
  templateUrl: './topbar-exclude.component.html',
  styleUrls: ['./topbar-exclude.component.scss']
})
export class TopbarExcludeComponent implements OnInit {

  @Output() openEventExclude = new EventEmitter<string[]>();

  project: Project;
  projectName: string;
  projects: string[];
  simplifiedCCSLSet: CCSLSet;
  orchestrateCCSLSet: CCSLSet;
  inconsistentLocateCCSLSet: CCSLSet;
  version;

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
        // this.userName = jQuery.parseJSON(cookie).username;
        // console.log(this.userName)
      }
    } else {
      // this.userName = "Not Login"
    }

    projectService.changeProjectEmitted$.subscribe(
      project => {
        this.project = project;
        this.projectName = project.title;
      });
  }

  ngOnInit(): void {
  }

  toHomePage(): void {
    this.router.navigate(['/home']);
  }

  saveProject(): void {
    document.getElementById('help-exclude').style.display = 'none';
    document.getElementById('content-exclude').style.display = 'block';
    let result: boolean;
    console.log(this.project);
    if (this.project.title == null) {
      alert('该项目为空！');
      return;
    }
    this.projectName = this.project.title;
    console.log('this.project.inconsistentCcslSet: ' + this.project.inconsistentLocateCcslSet);
    this.fileService.saveProject(this.projectName, this.project).subscribe(
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
  // todo 打开已保存的项目，并提取合并后的 CCSL
  openProject2(): void {
    document.getElementById('help-exclude').style.display = 'none';
    document.getElementById('content-exclude').style.display = 'block';
    this.fileService.searchProject().subscribe(
      projects => {
        this.projects = projects;
        console.log(this.projects);
        this.openEventExclude.emit(projects);
      }
    );
  }

  // 简化
  CCSLSimplify(): void {
    // console.log(this.project);
    if (!this.project) {
      alert('请先新建或打开一个项目！');
    } else if (this.project.composedCcslSet == null) {
      alert('请先完成 CCSL 约束的合并！');
    } else {
      this.projectService.CCSLSimplify(this.project).subscribe(
        ccslSet => {
          console.log(ccslSet);
          this.project.simplifiedCcslSet = ccslSet;
          this.projectService.sendProject(this.project);
          setTimeout(() => {
            this.change(this.simplifiedCCSLSet.id);
          }, 0);
        });
    }
  }

  // 编排
  CCSLOrchestrate(): void {
    console.log(this.project);
    if (!this.project) {
      alert('请先新建或打开一个项目！');
    } else if (this.project.simplifiedCcslSet == null) {
      alert('请先完成 CCSL 约束的简化！');
    } else {
      this.projectService.CCSLOrchestrate(this.project).subscribe(
        ccslSet => {
          console.log(ccslSet);
          this.project.orchestrateCcslSet = ccslSet;
          this.projectService.sendProject(this.project);
          setTimeout(() => {
            this.change(this.orchestrateCCSLSet.id);
          }, 0);
        });
    }
  }

  // 不一致性定位
  LocateInconsistency(): void {
    console.log(this.project);
    if (!this.project) {
      alert('请先新建或打开一个项目！');
    } else if (this.project.orchestrateCcslSet == null) {
      alert('请先完成互斥不一致场景的编排！');
    } else {
      this.projectService.LocateInconsistency(this.project).subscribe(
        ccslSet => {
          console.log(ccslSet);
          this.project.inconsistentLocateCcslSet = ccslSet;
          this.projectService.sendProject(this.project);
          setTimeout(() => {
            this.change(this.inconsistentLocateCCSLSet.id);
          }, 0);
        });
    }
  }

  change(title: string): void {
    console.log(title + '-P');
    let parTab;
    if (title.startsWith('Composed')) {
      parTab = document.getElementById('composedCCSL-exclude').parentElement;
    } else if (title.startsWith('Simplified')){
      parTab = document.getElementById('simplifiedCCSL-exclude').parentElement;
    } else if (title.startsWith('Orchestrated')){
      parTab = document.getElementById('orchestratedCCSL-exclude').parentElement;
    } else {
      parTab = document.getElementById('inconsistentLocateCCSL-exclude').parentElement;
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
          document.getElementById(id + '-P-exclude').style.display = 'none';
          const cgId = id.replace('CCSL', 'CG');
          // console.log(cgId)
          document.getElementById(cgId + '-P-exclude').style.display = 'none';
          if (this.project.composedCcslSet != null && this.project.composedCcslSet.id != null) {
            document.getElementById('ComposedCCSL-P-exclude').style.display = 'none';
            document.getElementById('ComposedCG-P-exclude').style.display = 'none';
          }
          if (this.project.simplifiedCcslSet != null && this.project.simplifiedCcslSet.id != null) {
            document.getElementById('SimplifiedCCSL-P-exclude').style.display = 'none';
            document.getElementById('SimplifiedCG-P-exclude').style.display = 'none';
          }
          if (this.project.orchestrateCcslSet != null && this.project.orchestrateCcslSet.id != null) {
            document.getElementById('OrchestratedCCSL-P-exclude').style.display = 'none';
            document.getElementById('OrchestratedCG-P-exclude').style.display = 'none';
          }
          if (this.project.inconsistentLocateCcslSet != null && this.project.inconsistentLocateCcslSet.id != null) {
            document.getElementById('InconsistentLocateCCSL-P-exclude').style.display = 'none';
            document.getElementById('InconsistentLocateCG-P-exclude').style.display = 'none';
          }
        }
      }
    }

    // console.log(document.getElementById(title + "-P"))
    document.getElementById(title + '-P-exclude').style.display = 'block';
    document.getElementById(cgTitle + '-P-exclude').style.display = 'block';

    const time = (new Date()).getTime();
    const userName = this.projectService.getUserName();

    const url = `http://localhost:8071/project/display?userName=${userName}&projectName=${this.projectName}&version=${this.version}&fileName=${cgTitle}&time=${time}`;
    console.log(url);
    const ID = cgTitle + '-Pag-exclude';
    console.log(ID);
    console.log(document.getElementById(ID));
    // console.log($(ID));
    // $(ID).attr("src", url);
    document.getElementById(ID).setAttribute('src', url);

    document.getElementById('ccslText-exclude').innerHTML = 'CCSL 约束:';
    document.getElementById('cgsText-exclude').innerHTML = '时钟图:';
    const ccslText = document.getElementById('ccslText-exclude').innerHTML;
    let newCcslText = null;
    if (title.startsWith('CCSL')) {
      newCcslText = '情景图 ' + title.split('CCSL-')[1] + ' 的 ' + ccslText.slice(0, 16);
    } else if (title.startsWith('Composed')) {
      newCcslText = '合并后的 ' + ccslText;
    } else if (title.startsWith('Simplified')){
      newCcslText = '简化后的 ' + ccslText;
    } else if (title.startsWith('Orchestrated')){
      newCcslText = '编排后的 ' + ccslText;
    } else if (title.startsWith('Inconsistent')) {
      newCcslText = '用于互斥不一致场景编排的 ' + ccslText;
    }
    console.log(newCcslText);
    document.getElementById('ccslText-exclude').innerHTML = newCcslText;
    const cgsText = document.getElementById('cgsText-exclude').innerHTML;
    let newCgsText = null;
    if (title.startsWith('CCSL')) {
      newCgsText = cgsText.slice(0, 3) + ' ' + title.split('CCSL-')[1] + cgsText.slice(3, 4);
    } else if (title.startsWith('Composed')) {
      newCgsText = '合并后的 ' + cgsText;
    } else if (title.startsWith('Simplified')){
      newCgsText = '简化后的 ' + cgsText;
    } else if (title.startsWith('Orchestrated')){
      newCgsText = '编排后的 ' + cgsText;
    } else if (title.startsWith('Inconsistent')) {
      newCgsText = '用于不一致场景编排的 CCSL 对应的 时钟图';
    }
    console.log(newCgsText);
    document.getElementById('cgsText-exclude').innerHTML = newCgsText;
  }

  help(): void {
    console.log('help');
    console.log(document.getElementById('content-exclude'));
    document.getElementById('content-exclude').style.display = 'none';
    document.getElementById('help-exclude').style.display = 'block';
  }
}
