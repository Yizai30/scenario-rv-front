import { Component, OnInit } from '@angular/core';
import {Project} from '../entity/Project';
import {CCSLSet} from '../entity/CCSLSet';
import {VisualizedScenario} from '../entity/VisualizedScenario';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';

@Component({
  selector: 'app-content-exclude',
  templateUrl: './content-exclude.component.html',
  styleUrls: ['./content-exclude.component.scss']
})
export class ContentExcludeComponent implements OnInit {

  project: Project;
  projectName: string;

  ccslSetList: CCSLSet[];

  version;
  composedCcslSet: CCSLSet;
  simplifiedCCSLSet: CCSLSet;
  orchestrateCCSLSet: CCSLSet;
  inconsistentLocateSDPngs: string[] = [];
  composedCcslFlag = false;
  simplifiedCcslFlag = false;
  orchestratedCcslFlag = false;
  inconsistentLocateSdFlag = false;
  CCG: string[] = [];
  SCG: string[] = [];
  OCG: string[] = [];
  LSD: string[] = [];
  visualizedScenario: VisualizedScenario;
  // 情景图列表
  sdSrcList: string[] = [];

  constructor(
    private fileService: FileService,
    private projectService: ProjectService,
  ) {
    projectService.changeProjectEmitted$.subscribe(
      project => {
        this.project = project;
        console.log(this.project);
        this.projectName = project.title;
        console.log('inconsistentLocateSdPngs' + this.project.inconsistentLocateSdPngNameList);

        if (this.project.composedCcslSet != null) {
          console.log('hahaha-exclude');
          this.composedCcslSet = this.project.composedCcslSet;
          this.composedCcslFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.CCG.length != 1) {
            this.CCG.push('ComposedCG');
          }
        }
        if (this.project.simplifiedCcslSet != null) {
          this.simplifiedCCSLSet = this.project.simplifiedCcslSet;
          this.simplifiedCcslFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.SCG.length != 1) {
            this.SCG.push('SimplifiedCG');
          }
        }
        if (this.project.orchestrateCcslSet != null) {
          this.orchestrateCCSLSet = this.project.orchestrateCcslSet;
          this.orchestratedCcslFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.OCG.length != 1) {
            this.OCG.push('OrchestratedCG');
          }
        }
        if (this.project.inconsistentLocateSdPngNameList != null) {
          console.log('inconsistentLocateSdPngs' + this.project.inconsistentLocateSdPngNameList);
          this.inconsistentLocateSDPngs = this.project.inconsistentLocateSdPngNameList;
          this.inconsistentLocateSdFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.LSD.length != 1) {
            this.LSD.push('InconsistentLocateSD');
          }
        }
      });
    fileService.sendVersionEmmited$.subscribe(
      version => {
        // console.log(version)
        this.version = version;
      });
  }

  ngOnInit(): void {
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
      parTab = document.getElementById('inconsistentLocateSDPngs-exclude').parentElement;
      document.getElementById('inconsistentLocateSDPngs-exclude').style.display = 'block';
    }
    console.log(parTab);
    const tabs = parTab.children;
    console.log(tabs);
    const cgTitle = title.replace('CCSL', 'CG');
    console.log(cgTitle);

    if (this.project.composedCcslSet != null && this.project.composedCcslSet.id != null) {
      if (!title.startsWith('Inconsistent')) {
        document.getElementById('ComposedCCSL-P-exclude').style.display = 'none';
      }
      document.getElementById('ComposedCG-P-exclude').style.display = 'none';
    }
    if (this.project.simplifiedCcslSet != null && this.project.simplifiedCcslSet.id != null) {
      if (!title.startsWith('Inconsistent')) {
        document.getElementById('SimplifiedCCSL-P-exclude').style.display = 'none';
      }
      document.getElementById('SimplifiedCG-P-exclude').style.display = 'none';
    }
    if (this.project.orchestrateCcslSet != null && this.project.orchestrateCcslSet.id != null) {
      if (!title.startsWith('Inconsistent')) {
        document.getElementById('OrchestratedCCSL-P-exclude').style.display = 'none';
      }
      document.getElementById('OrchestratedCG-P-exclude').style.display = 'none';
    }
    if (this.project.inconsistentLocateSdPngNameList != null) {
      document.getElementById('InconsistentLocateSD-P-exclude').style.display = 'none';
    }

    if (!title.startsWith('Inconsistent')) {
      document.getElementById(title + '-P-exclude').style.display = 'block';
      document.getElementById(cgTitle + '-P-exclude').style.display = 'block';
    } else {
      document.getElementById('InconsistentLocateSD-P-exclude').style.display = 'block';
    }

    const time = (new Date()).getTime();
    const userName = this.projectService.getUserName();

    let url = `http://localhost:8071/project/display?userName=${userName}&projectName=${this.projectName}&version=${this.version}&fileName=${cgTitle}&time=${time}`;
    console.log(url);
    let ID = '';
    if (!title.startsWith('Inconsistent')) {
      ID = cgTitle + '-Pag-exclude';
    } else {
      ID = 'InconsistentLocateSD-Pag-exclude';
    }
    console.log(ID);
    console.log(document.getElementById(ID));
    // console.log($(ID));
    // $(ID).attr("src", url);
    if (!title.startsWith('Inconsistent')) {
      document.getElementById(ID).setAttribute('src', url);
    } else {
      url = `http://localhost:8071/project/display?userName=${userName}&projectName=${this.projectName}&version=${this.version}&fileName=SD&time=${time}`;
      document.getElementById(ID).setAttribute('src', url);
    }

    if (!title.startsWith('Inconsistent')) {
      document.getElementById('ccslText-exclude').innerHTML = 'CCSL 约束:';
      document.getElementById('cgsText-exclude').innerHTML = '时钟图:';
    }
    const ccslText = document.getElementById('ccslText-exclude').innerHTML;
    let newCcslText = null;
    if (title.startsWith('Composed')) {
      newCcslText = '合并后的 ' + ccslText;
    } else if (title.startsWith('Simplified')){
      newCcslText = '简化后的 ' + ccslText;
    } else if (title.startsWith('Orchestrated')){
      newCcslText = '编排后的 ' + ccslText;
    }
    console.log(newCcslText);
    if (!title.startsWith('Inconsistent')) {
      document.getElementById('ccslText-exclude').innerHTML = newCcslText;
    }
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
      newCgsText = '互斥不一致场景对应的情景图：';
    }
    console.log(newCgsText);
    document.getElementById('cgsText-exclude').innerHTML = newCgsText;
  }

  resizeimg(ID: string, event): boolean {
    // console.log(ID);
    const img = document.getElementById(ID + '-Pag-exclude');
    // console.log(img);
    let zoom = parseInt(img.style.zoom, 10) || 100;
    zoom += event.wheelDelta / 12;
    if (zoom > 0) { img.style.zoom = zoom + '%'; }
    return false;
  }

  downloadproject(filename): void{
    const url = 'http://localhost:8088/file/downloadProject/' + filename ;
    console.log(url);
    this.download(url);
  }

  download(url): void{
    const form = document.createElement('form');
    document.body.appendChild(form);
    form.style.display = 'none';
    form.action = url;
    form.id = 'excel';
    form.method = 'post';
    const newElement = document.createElement('input');
    newElement.setAttribute('type', 'hidden');
    form.appendChild(newElement);
    form.submit();
  }

  play(fileName): void {
    document.getElementById('play-exclude').style.display = 'block';
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function(): void {
      const vid = document.getElementById('video1-exclude');
      // tslint:disable-next-line:triple-equals
      if (vid != undefined) {
        vid.setAttribute('src', 'http://localhost:8088/file/Demo?fileName=' + fileName);
      }
      console.log(vid);
    }, 500);
  }

  close(id): void {
    document.getElementById(id).style.display = 'none';
  }
}
