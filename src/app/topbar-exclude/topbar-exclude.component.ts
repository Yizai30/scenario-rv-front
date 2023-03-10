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
  inconsistentLocateSDPngs: string[];
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
    // console.log(this.project);
    if (this.project.title == null) {
      alert('??????????????????');
      return;
    }
    this.projectName = this.project.title;
    // console.log('this.project.inconsistentCcslSet: ' + this.project.inconsistentLocateCcslSet);
    console.log(this.project);
    this.fileService.saveProject(this.project).subscribe(
      res => {
        result = res;
        if (!result) {
          alert('???????????????');
        } else {
          alert('???????????????');
        }
      }
    );
  }
  // todo ???????????????????????????????????????????????? CCSL
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

  // ??????
  CCSLSimplify(): void {
    // console.log(this.project);
    if (!this.project) {
      alert('????????????????????????????????????');
    } else if (this.project.composedCcslSet == null) {
      alert('???????????? CCSL ??????????????????');
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

  // ??????
  CCSLOrchestrate(): void {
    console.log(this.project);
    if (!this.project) {
      alert('????????????????????????????????????');
    } else if (this.project.simplifiedCcslSet == null) {
      alert('???????????? CCSL ??????????????????');
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

  // ??????????????????
  LocateInconsistency(): void {
    console.log(this.project);
    if (!this.project) {
      alert('????????????????????????????????????');
    } else if (this.project.orchestrateCcslSet == null) {
      alert('?????????????????????????????????????????????');
    } else {
      this.projectService.LocateInconsistency(this.project).subscribe(
        sdPngNameList => {
          console.log(sdPngNameList);
          this.project.inconsistentLocateSdPngNameList = sdPngNameList;
          this.projectService.sendProject(this.project);
          setTimeout(() => {
            this.change('InconsistentLocateSDPngs');
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
      document.getElementById('inconsistentLocateSDPngs-exclude').style.display = 'block';
    }
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
    if (!title.startsWith('Inconsistent')) {
      document.getElementById(ID).setAttribute('src', url);
    } else {
      url = `http://localhost:8071/project/display?userName=${userName}&projectName=${this.projectName}&version=${this.version}&fileName=SD&time=${time}`;
      document.getElementById(ID).setAttribute('src', url);
    }

    if (!title.startsWith('Inconsistent')) {
      document.getElementById('ccslText-exclude').innerHTML = 'CCSL ??????:';
      document.getElementById('cgsText-exclude').innerHTML = '?????????:';
    }
    const ccslText = document.getElementById('ccslText-exclude').innerHTML;
    let newCcslText = null;
    if (title.startsWith('Composed')) {
      newCcslText = '???????????? ' + ccslText;
    } else if (title.startsWith('Simplified')){
      newCcslText = '???????????? ' + ccslText;
    } else if (title.startsWith('Orchestrated')){
      newCcslText = '???????????? ' + ccslText;
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
      newCgsText = '???????????? ' + cgsText;
    } else if (title.startsWith('Simplified')){
      newCgsText = '???????????? ' + cgsText;
    } else if (title.startsWith('Orchestrated')){
      newCgsText = '???????????? ' + cgsText;
    } else if (title.startsWith('Inconsistent')) {
      newCgsText = '??????????????????????????????????????????';
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
