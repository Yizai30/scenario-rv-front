import {Component, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {CCSLSet} from '../entity/CCSLSet';
import {Project} from '../entity/Project';
import {TimeEvent} from '../entity/TimeEvent';
import {VisualizedScenario} from '../entity/VisualizedScenario';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';

@Component({
  selector: 'app-content-component',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  project: Project;
  projectName: string;

  ccslSetList: CCSLSet[];

  version;
  composedCcslSet: CCSLSet;
  simplifiedCCSLSet: CCSLSet;
  orchestrateCCSLSet: CCSLSet;
  ccslFlag = false;
  composedCcslFlag = false;
  simplifiedCcslFlag = false;
  orchestratedCcslFlag = false;
  CGs: string[] = [];
  CCG: string[] = [];
  SCG: string[] = [];
  OCG: string[] = [];
  visualizedScenario: VisualizedScenario;

  // tslint:disable-next-line:typedef
  onMouseEnter() {
    document.getElementById('orchestrateList').style.visibility = String('visible');
  }

  // tslint:disable-next-line:typedef
  onMouseLeave() {
    document.getElementById('orchestrateList').style.visibility = String('hidden');
  }

  constructor(
    private fileService: FileService,
    private projectService: ProjectService,
  ) {
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
      parTab = document.getElementById('composedCCSL').parentElement;
    } else if (title.startsWith('Simplified')) {
      parTab = document.getElementById('simplifiedCCSL').parentElement;
    } else if (title.startsWith('Orchestrated')) {
      parTab = document.getElementById('orchestratedCCSL').parentElement;
    } else {
      parTab = document.getElementById(title).parentElement.parentElement;
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
        console.log('ctabs.length: ' + ctabs.length);
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < ctabs.length; j++) {
          // console.log(ctabs[j]);
          const id = ctabs[j].getAttribute('id');
          // console.log('ctabs[j].id: ' + id);
          document.getElementById(id + '-P').style.display = 'none';
          const cgId = id.replace('CCSL', 'CG');
          console.log('cgId: ' + cgId);
          document.getElementById(cgId + '-P').style.display = 'none';
          console.log('this.project.composedCcslSet: ' + this.project.composedCcslSet);
          console.log('this.project.composedCcslSet.id: ' + this.project.composedCcslSet.id);
          if (this.project.composedCcslSet != null && this.project.composedCcslSet.id != null) {
            // console.log('hahaha');
            document.getElementById('ComposedCCSL-P').style.display = 'none';
            document.getElementById('ComposedCG-P').style.display = 'none';
          }
          // if (this.project.simplifiedCcslSet != null && this.project.simplifiedCcslSet.id != null) {
          //   document.getElementById('SimplifiedCCSL-P').style.display = 'none';
          //   document.getElementById('SimplifiedCG-P').style.display = 'none';
          // }
          // if (this.project.orchestrateCcslSet != null && this.project.orchestrateCcslSet.id != null) {
          //   document.getElementById('OrchestratedCCSL-P').style.display = 'none';
          //   document.getElementById('OrchestratedCG-P').style.display = 'none';
          // }
        }
      }
    }

    // console.log(document.getElementById(title + "-P"))
    document.getElementById(title + '-P').style.display = 'block';
    document.getElementById(cgTitle + '-P').style.display = 'block';

    const time = (new Date()).getTime();
    const userName = this.projectService.getUserName();

    const url = `http://localhost:8071/project/display?userName=${userName}&projectName=${this.projectName}&version=${this.version}&fileName=${cgTitle}&time=${time}`;
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
    } else if (title.startsWith('Simplified')) {
      newCcslText = '简化后的 ' + ccslText;
    } else if (title.startsWith('Orchestrated')) {
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
    } else if (title.startsWith('Simplified')) {
      newCgsText = '简化后的 ' + cgsText;
    } else if (title.startsWith('Orchestrated')) {
      newCgsText = '编排后的 ' + cgsText;
    }
    console.log(newCgsText);
    document.getElementById('cgsText').innerHTML = newCgsText;
  }

  setHeight(ccslSetList: CCSLSet[]): void {
    // console.log(ccslSetList)
    if (ccslSetList.length > 0) {
      const parTab = document.getElementById(ccslSetList[0].id).parentElement;
      // console.log(parTab)
      // parTab.setAttribute("height", 30 * (ccslSetList.length + 1) + "px !important");
      parTab.style.height = 30 * (ccslSetList.length + 1) + 'px';
    }
  }

  resetHeight(ccslSetList: CCSLSet[]): void {
    if (ccslSetList.length > 0) {
      const parTab = document.getElementById(ccslSetList[0].id).parentElement;
      // console.log(parTab)
      // parTab.setAttribute("height", "30px");
      parTab.style.height = '30px';
    }
  }

  resizeimg(ID: string, event): boolean {
    // console.log(ID);
    const img = document.getElementById(ID + '-Pag');
    // console.log(img);
    let zoom = parseInt(img.style.zoom, 10) || 100;
    zoom += event.wheelDelta / 12;
    if (zoom > 0) {
      img.style.zoom = zoom + '%';
    }
    return false;
  }

  downloadproject(filename): void {
    const url = 'http://localhost:8088/file/downloadProject/' + filename;
    console.log(url);
    this.download(url);
  }

  download(url): void {
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
    document.getElementById('play').style.display = 'block';
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function(): void {
      const vid = document.getElementById('video1');
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
