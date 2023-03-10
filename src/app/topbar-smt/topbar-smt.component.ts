import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Project} from '../entity/Project';
import {CCSLSet} from '../entity/CCSLSet';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';
import {Router} from '@angular/router';
import {AppSmtComponent} from '../app-smt/app-smt.component';
import {SMTCheckRes} from '../entity/SMTCheckRes';

let askResultUrl = '';
let timeCnt = 0;
let intervalClock: any;

@Component({
  selector: 'app-topbar-smt',
  templateUrl: './topbar-smt.component.html',
  styleUrls: ['./topbar-smt.component.scss']
})
export class TopbarSmtComponent implements OnInit {

  @Output() openEventSmt = new EventEmitter<string[]>();

  project: Project;
  projectName: string;
  projects: string[];
  smtCheck = false;
  isLocalize = false;
  localizeReady = false;
  localizeCanClick = false;
  version;

  constructor(
    private http: HttpClient,
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

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  ngOnInit(): void {
  }

  toHomePage(): void {
    this.router.navigate(['/home']);
  }

  saveProject(): void {
    document.getElementById('help-smt').style.display = 'none';
    document.getElementById('content-smt').style.display = 'block';
    let result: boolean;
    console.log(this.project);
    if (this.project.title == null) {
      alert('??????????????????');
      return;
    }
    this.projectName = this.project.title;
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

  openProject2(): void {
    document.getElementById('help-smt').style.display = 'none';
    document.getElementById('content-smt').style.display = 'block';
    this.fileService.searchProject().subscribe(
      projects => {
        this.projects = projects;
        console.log(this.projects);
        this.openEventSmt.emit(projects);
      }
    );
  }

  smtCheckBox(): void {
    if (!this.project) {
      alert('????????????????????????????????????');
    } else if (!this.project.composedCcslSet) {
      return;
    } else {
      document.getElementById('popLayer-smt').style.display = 'block';
      document.getElementById('SMTCheck').style.display = 'block';
    }
    this.smtCheck = true;
    this.localizeReady = this.project.composedCcslSet && this.smtCheck;
    this.localizeCanClick = this.localizeReady && !this.isLocalize;
  }

  askRes(): void {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 0; // ??????????????????????????????
    xhr.open('GET', askResultUrl, true);
    xhr.send();
    xhr.onload = e => {
      // ????????????????????????????????????
      console.log('xhr.status:', xhr.status);
      console.log('Http.responseText:', xhr.responseText);
      const tmpSmtCheckRes = JSON.parse(xhr.responseText);
      console.log('---> tmpSmtCheckRes: ' + tmpSmtCheckRes);
      timeCnt += 1;
      if (timeCnt * 10 > 1800) {
        // timeCnt??????????????????????????????????????????10s????????????????????????1800??????30????????????????????????????????????????????????????????????
        // this.fileService.version = 'This will cost more than 30 minutes, please check after completion';
        // this.safenlService.setConsistent(consistents);
        clearInterval(intervalClock);
        console.log('??????????????????????????????', intervalClock);
      }
    };
  }

  minUnsat_smt(): void{
    if (!this.project) {
      alert('????????????????????????????????????');
    } else if (this.project.smtRes == null) {
      alert('?????????????????????');
    } else {
      alert('??????????????????????????????????????????');
      this.projectService.minUnsat(this.project).subscribe(
        smtCheckRes => {
          console.log(smtCheckRes);
          this.project.smtCheckRes = smtCheckRes;
          this.projectService.sendProject(this.project);
          alert('???????????????');
          setTimeout(() => {}, 0);
        });
    }
    askResultUrl = `http://localhost:8071/check/getMinUnsatResult?projectName=${this.projectName}`;
    timeCnt = 0;
    intervalClock = setInterval(this.askRes.bind(this), 10000);
    this.isLocalize = true;
    this.localizeCanClick = this.localizeReady && !this.isLocalize;
  }

  lookCheckResult(): void {
    if (!this.project) {
      alert('????????????????????????????????????');
    } else if (this.project.smtRes == null) {
      alert('?????????????????????');
    } else {
      document.getElementById('cgsText-smt').innerText = '???????????????';
      document.getElementById('smtResName').style.display = 'block';
      document.getElementById('smt-res-result').style.display = 'block';
      document.getElementById('smt-locate-result').style.display = 'none';
    }
  }

  lookLocalizeResult(): void {
    if (!this.project) {
      alert('????????????????????????????????????');
    } else if (this.project.smtRes == null) {
      alert('?????????????????????');
    } else if (this.project.smtCheckRes == null) {
      alert('?????????????????????');
    } else {
      document.getElementById('cgsText-smt').innerText = '???????????????';
      document.getElementById('smtResName').style.display = 'none';
      document.getElementById('smt-res-result').style.display = 'none';
      document.getElementById('smt-locate-result').style.display = 'block';
      if (this.project.smtCheckRes.res.length === 0) {
        document.getElementById('smt-locate-result').innerHTML = `
        <div>
          ??????????????????
        </div>
      `;
      } else {
        document.getElementById('smt-locate-result').innerHTML = `
        <div>
          ${this.project.smtCheckRes.res}
        </div>
      `;
      }
    }
  }

  change(title: string): void {
    console.log(title + '-P');
    let parTab;
    if (title.startsWith('ComposedCCSL')) {
      parTab = document.getElementById('composedCCSL-smt').parentElement;
    } else if (title.startsWith('ComposedCG')){
      parTab = document.getElementById('clockGraph-smt').parentElement;
    } else if (title.startsWith('CausalityCG')){
      parTab = document.getElementById('causalityClockGraph-smt').parentElement;
    } else if (title.startsWith('CircularDependencyCCSL')){
      parTab = document.getElementById('circularDependency-smt').parentElement;
    } else if (title.startsWith('CircularInconsistentLocateCCSL')){
      parTab = document.getElementById('inconsistentLocate-smt').parentElement;
    }
    console.log(parTab);
    const tabs = parTab.children;
    console.log(tabs);
    // const cgTitle = title.replace('CCSL', 'CG');
    // console.log(cgTitle);
    if (this.project.composedCcslSet != null && this.project.composedCcslSet.id != null) {
      document.getElementById('ComposedCCSL-P-smt').style.display = 'none';
      document.getElementById('ComposedCG-P-smt').style.display = 'none';
    }
    if (this.project.causalityCcslSet != null && this.project.causalityCcslSet.id != null) {
      document.getElementById('CausalityCG-P-smt').style.display = 'none';
    }
    if (this.project.circularDependencyCcslSet != null && this.project.circularDependencyCcslSet.id != null) {
      document.getElementById('CircularDependencyCCSL-P-smt').style.display = 'none';
    }
    if (this.project.circularInconsistentLocateCcslSet != null && this.project.circularInconsistentLocateCcslSet.id != null) {
      document.getElementById('CircularInconsistentLocateCCSL-P-smt').style.display = 'none';
    }

    // console.log(document.getElementById(title + "-P"))
    document.getElementById(title + '-P-smt').style.display = 'block';
    // document.getElementById(cgTitle + '-P-smt').style.display = 'block';

    const time = (new Date()).getTime();
    const userName = this.projectService.getUserName();

    if (title.endsWith('CG')) {
      const url = `http://localhost:8071/project/display?userName=${userName}&projectName=${this.projectName}&version=${this.version}&fileName=${title}&time=${time}`;
      console.log(url);
      const ID = title + '-Pag-smt';
      console.log(ID);
      console.log(document.getElementById(ID));
      document.getElementById(ID).setAttribute('src', url);
    }

    document.getElementById('text-smt').innerHTML = '???????????? CCSL ??????:';
    let newCcslText = null;
    if (title.startsWith('ComposedCCSL')) {
      newCcslText = '???????????? CCSL ??????:';
    } else if (title.startsWith('ComposedCG')) {
      newCcslText = '????????????';
    } else if (title.startsWith('CausalityCG')){
      newCcslText = '??????????????????';
    } else if (title.startsWith('CircularDependencyCCSL')){
      newCcslText = '???????????????';
    } else if (title.startsWith('CircularInconsistentLocateCCSL')) {
      newCcslText = '???????????????????????????';
    }
    console.log(newCcslText);
    document.getElementById('text-smt').innerHTML = newCcslText;
  }

  help(): void {
    console.log('help');
    console.log(document.getElementById('content-smt'));
    document.getElementById('content-smt').style.display = 'none';
    document.getElementById('help-smt').style.display = 'block';
  }

}
