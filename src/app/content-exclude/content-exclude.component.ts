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
  inconsistentLocateCCSLSet: CCSLSet;
  ccslFlag = false;
  composedCcslFlag = false;
  simplifiedCcslFlag = false;
  orchestratedCcslFlag = false;
  inconsistentLocateCcslFlag = false;
  // CGs: string[] = [];
  CCG: string[] = [];
  SCG: string[] = [];
  OCG: string[] = [];
  LCG: string[] = [];
  visualizedScenario: VisualizedScenario;

  constructor(
    private fileService: FileService,
    private projectService: ProjectService,
  ) {
    projectService.changeProjectEmitted$.subscribe(
      project => {
        this.project = project;
        console.log(this.project);
        this.projectName = project.title;

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
        if (this.project.inconsistentLocateCcslSet != null) {
          this.inconsistentLocateCCSLSet = this.project.inconsistentLocateCcslSet;
          this.inconsistentLocateCcslFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.LCG.length != 1) {
            this.LCG.push('InconsistentLocateCG');
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
      parTab = document.getElementById('inconsistentLocateCCSL-exclude').parentElement;
    }
    console.log(parTab);
    const tabs = parTab.children;
    console.log(tabs);
    const cgTitle = title.replace('CCSL', 'CG');
    console.log(cgTitle);
    if (this.project.composedCcslSet != null && this.project.composedCcslSet.id != null) {
      document.getElementById('ComposedCCSL-P-exclude').style.display = 'none';
      document.getElementById('ComposedCG-P-exclude').style.display = 'none';
    }
    if (this.project.simplifiedCcslSet != null && this.project.simplifiedCcslSet.id != null) {
      console.log('hahaha');
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
      newCgsText = '用于不一致场景编排的 CCSL 对应的时钟图：';
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
