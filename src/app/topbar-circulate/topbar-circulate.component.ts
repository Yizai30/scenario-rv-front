import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Project} from '../entity/Project';
import {CCSLSet} from '../entity/CCSLSet';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-topbar-circulate',
  templateUrl: './topbar-circulate.component.html',
  styleUrls: ['./topbar-circulate.component.scss']
})
export class TopbarCirculateComponent implements OnInit {

  @Output() openEventCirculate = new EventEmitter<string[]>();

  project: Project;
  projectName: string;
  projects: string[];
  causalityCCSLSet: CCSLSet;
  circularDependencyCCSLSet: CCSLSet;
  circularInconsistentLocateCCSLSet: CCSLSet;
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
    document.getElementById('help-circulate').style.display = 'none';
    document.getElementById('content-circulate').style.display = 'block';
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
    document.getElementById('help-circulate').style.display = 'none';
    document.getElementById('content-circulate').style.display = 'block';
    this.fileService.searchProject().subscribe(
      projects => {
        this.projects = projects;
        console.log(this.projects);
        this.openEventCirculate.emit(projects);
      }
    );
  }

  getCirculateConsistent(): void {
    console.log(this.project);
    if (!this.project) {
      alert('????????????????????????????????????');
    } else {
      this.projectService.getCirculateConsistent(this.project).subscribe(
        circulateConsistentResList => {
          console.log(circulateConsistentResList);
          this.project.circulateConsistentResList = circulateConsistentResList;
          this.project.causalityCGName = this.project.title + '-CCG';
          this.projectService.sendProject(this.project);
          console.log(this.project);
          setTimeout(() => {
            this.change('CausalityCG');
          }, 0);
        });
    }
  }

  // todo ????????????????????????
  LocateInconsistency(): void {
    console.log(this.project);
    if (!this.project) {
      alert('????????????????????????????????????');
    } else if (this.project.causalityCcslSet == null) {
      alert('?????????????????????');
    } else {
      this.projectService.LocateInconsistency(this.project).subscribe(
        ccslSet => {
          console.log(ccslSet);
          // this.project.circularInconsistentLocateCcslSet = ccslSet;
          this.projectService.sendProject(this.project);
          setTimeout(() => {
            this.change(this.circularInconsistentLocateCCSLSet.id);
          }, 0);
        });
    }
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
    if (this.project.causalityCGName != null) {
      document.getElementById('CausalityCG-P-circulate').style.display = 'none';
    }
    if (this.project.circularDependencyCcslSet != null && this.project.circularDependencyCcslSet.id != null) {
      document.getElementById('CircularDependencyCCSL-P-circulate').style.display = 'none';
    }
    if (this.project.circularInconsistentLocateCcslSet != null && this.project.circularInconsistentLocateCcslSet.id != null) {
      document.getElementById('CircularInconsistentLocateCCSL-P-circulate').style.display = 'none';
    }

    // console.log(document.getElementById(title + "-P"))
    document.getElementById(title + '-P-circulate').style.display = 'block';
    // document.getElementById(cgTitle + '-P-circulate').style.display = 'block';

    const time = (new Date()).getTime();
    const userName = this.projectService.getUserName();

    if (title.endsWith('CG')) {
      let CGFileName = '';
      if (title.startsWith('CausalityCG')) {
        CGFileName = this.projectName + '-CCG';
      } else if (title.startsWith('ComposedCG')) {
        CGFileName = 'ComposedCG';
      }
      const url = `http://localhost:8071/project/display?userName=${userName}&projectName=${this.projectName}&version=${this.version}&fileName=${CGFileName}&time=${time}`;
      console.log(url);
      const ID = title + '-Pag-circulate';
      console.log(ID);
      console.log(document.getElementById(ID));
      document.getElementById(ID).setAttribute('src', url);
    }

    document.getElementById('text-circulate').innerHTML = '???????????? CCSL ??????:';
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
    document.getElementById('text-circulate').innerHTML = newCcslText;
  }

  help(): void {
    console.log('help');
    console.log(document.getElementById('content-circulate'));
    document.getElementById('content-circulate').style.display = 'none';
    document.getElementById('help-circulate').style.display = 'block';
  }

}
