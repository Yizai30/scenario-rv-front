import { Component, OnInit } from '@angular/core';
import {Project} from '../entity/Project';
import {CCSLSet} from '../entity/CCSLSet';
import {VisualizedScenario} from '../entity/VisualizedScenario';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';

@Component({
  selector: 'app-content-circulate',
  templateUrl: './content-circulate.component.html',
  styleUrls: ['./content-circulate.component.scss']
})
export class ContentCirculateComponent implements OnInit {

  project: Project;
  projectName: string;

  version;
  composedCcslSet: CCSLSet;
  causalityCCSLSet: CCSLSet;
  circularDependencyCCSLSet: CCSLSet;
  circularInconsistentLocateCCSLSet: CCSLSet;
  composedCcslFlag = false;
  causalityCcslFlag = false;
  CCG: string[] = [];
  CACG: string[] = [];
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
          // console.log('hahaha-circulate');
          this.composedCcslSet = this.project.composedCcslSet;
          this.composedCcslFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.CCG.length != 1) {
            this.CCG.push('ComposedCG');
          }
        }

        if (this.project.causalityCcslSet != null) {
          // console.log('hahaha-circulate');
          this.causalityCCSLSet = this.project.causalityCcslSet;
          this.causalityCcslFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.CACG.length != 1) {
            this.CACG.push('CausalityCG');
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
    if (title.startsWith('ComposedCCSL')) {
      parTab = document.getElementById('composedCCSL-circulate').parentElement;
    } else if (title.startsWith('ComposedCG')){
      parTab = document.getElementById('clockGraph-circulate').parentElement;
    } else if (title.startsWith('CausalityCG')){
      parTab = document.getElementById('causalityClockGraph-circulate').parentElement;
    } else if (title.startsWith('CircularDependencyCCSL')){
      parTab = document.getElementById('circularDependency-circulate').parentElement;
    } else if (title.startsWith('CircularInconsistentLocateCCSL')){
      parTab = document.getElementById('inconsistentLocate-circulate').parentElement;
    }
    console.log(parTab);
    const tabs = parTab.children;
    console.log(tabs);
    // const cgTitle = title.replace('CCSL', 'CG');
    // console.log(cgTitle);
    if (this.project.composedCcslSet != null && this.project.composedCcslSet.id != null) {
      document.getElementById('ComposedCCSL-P-circulate').style.display = 'none';
      document.getElementById('ComposedCG-P-circulate').style.display = 'none';
    }
    if (this.project.causalityCcslSet != null && this.project.causalityCcslSet.id != null) {
      document.getElementById('CausalityCG-P-circulate').style.display = 'none';
    }
    if (this.project.circularDependencyCcslSet != null && this.project.circularDependencyCcslSet.id != null) {
      document.getElementById('CircularDependencyCCSL-P-circulate').style.display = 'none';
    }
    if (this.project.circularInconsistentLocateCcslSet != null && this.project.circularInconsistentLocateCcslSet.id != null) {
      document.getElementById('CircularInconsistentLocateCCSL-P-circulate').style.display = 'none';
    }

    // console.log(document.getElementById(title + "-P"))
    console.log('title: ' + title);
    document.getElementById(title + '-P-circulate').style.display = 'block';
    // document.getElementById(cgTitle + '-P-circulate').style.display = 'block';

    const time = (new Date()).getTime();
    const userName = this.projectService.getUserName();

    if (title.endsWith('CG')) {
      const url = `http://localhost:8071/project/display?userName=${userName}&projectName=${this.projectName}&version=${this.version}&fileName=${title}&time=${time}`;
      console.log(url);
      const ID = title + '-Pag-circulate';
      console.log(ID);
      console.log(document.getElementById(ID));
      document.getElementById(ID).setAttribute('src', url);
    }

    document.getElementById('text-circulate').innerHTML = '合并后的 CCSL 约束:';
    let newCcslText = null;
    if (title.startsWith('ComposedCCSL')) {
      newCcslText = '合并后的 CCSL 约束:';
    } else if (title.startsWith('ComposedCG')) {
      newCcslText = '时钟图：';
    } else if (title.startsWith('CausalityCG')){
      newCcslText = '因果时钟图：';
    } else if (title.startsWith('CircularDependencyCCSL')){
      newCcslText = '循环依赖：';
    } else if (title.startsWith('CircularInconsistentLocateCCSL')) {
      newCcslText = '不一致性定位结果：';
    }
    console.log(newCcslText);
    document.getElementById('text-circulate').innerHTML = newCcslText;
  }

  resizeimg(ID: string, event): boolean {
    // console.log(ID);
    const img = document.getElementById(ID + '-Pag-circulate');
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
    document.getElementById('play-circulate').style.display = 'block';
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function(): void {
      const vid = document.getElementById('video1-circulate');
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
