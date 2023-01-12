import { Component, OnInit } from '@angular/core';
import {Project} from '../entity/Project';
import {CCSLSet} from '../entity/CCSLSet';
import {VisualizedScenario} from '../entity/VisualizedScenario';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';
import {SMTRes} from '../entity/SMTRes';

@Component({
  selector: 'app-content-smt',
  templateUrl: './content-smt.component.html',
  styleUrls: ['./content-smt.component.scss']
})
export class ContentSMTComponent implements OnInit {

  project: Project;
  projectName: string;

  version;
  composedCcslSet: CCSLSet;
  smtInconsistentLocateCCSLSet: CCSLSet;
  composedCcslFlag = false;
  CCG: string[] = [];
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
          // console.log('hahaha-smt');
          this.composedCcslSet = this.project.composedCcslSet;
          this.composedCcslFlag = true;
          // tslint:disable-next-line:triple-equals
          if (this.CCG.length != 1) {
            this.CCG.push('ComposedCG');
          }
        }

      });
    fileService.sendVersionEmmited$.subscribe(
      version => {
        this.version = version;
      });
  }

  ngOnInit(): void {
    document.getElementById('smtResName').style.display = 'none';
    document.getElementById('smt-res-result').style.display = 'none';
  }

  change(title: string): void {
    console.log(title + '-P');
    let parTab;
    if (title.startsWith('ComposedCCSL')) {
      parTab = document.getElementById('composedCCSL-smt').parentElement;
    } else if (title.startsWith('ComposedCG')){
      parTab = document.getElementById('clockGraph-smt').parentElement;
    } else if (title.startsWith('SmtRes')) {
      document.getElementById('smt-res-result').style.display = 'block';
      // document.getElementById('smt-res-result').innerText = this.project.smtRes.res;
    }
    console.log(parTab);
    const tabs = parTab.children;
    console.log(tabs);
    if (this.project.composedCcslSet != null && this.project.composedCcslSet.id != null) {
      document.getElementById('ComposedCCSL-P-smt').style.display = 'none';
    }
    if (this.project.smtInconsistentLocateCcslSet != null && this.project.smtInconsistentLocateCcslSet.id != null) {
      document.getElementById('SmtInconsistentLocateCCSL-P-smt').style.display = 'none';
    }

    console.log('title: ' + title);
    document.getElementById(title + '-P-smt').style.display = 'block';

    const time = (new Date()).getTime();

    if (title.endsWith('CG')) {
      const url = `http://localhost:8071/project/display?projectName=${this.projectName}&fileName=${title}&time=${time}`;
      console.log(url);
      const ID = title + '-Pag-smt';
      console.log(ID);
      console.log(document.getElementById(ID));
      document.getElementById(ID).setAttribute('src', url);
    }

    document.getElementById('text-smt').innerHTML = '合并后的 CCSL 约束:';
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
    document.getElementById('text-smt').innerHTML = newCcslText;
  }

  resizeimg(ID: string, event): boolean {
    // console.log(ID);
    const img = document.getElementById(ID + '-Pag-smt');
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
    document.getElementById('play-smt').style.display = 'block';
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function(): void {
      const vid = document.getElementById('video1-smt');
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
