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
      alert('该项目为空！');
      return;
    }
    this.projectName = this.project.title;
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

  // todo 循环不一致性定位
  LocateInconsistency(): void {
    console.log(this.project);
    if (!this.project) {
      alert('请先新建或打开一个项目！');
    } else if (this.project.causalityCcslSet == null) {
      alert('请先完成验证！');
    } else {
      this.projectService.LocateInconsistency(this.project).subscribe(
        ccslSet => {
          console.log(ccslSet);
          this.project.circularInconsistentLocateCcslSet = ccslSet;
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

  help(): void {
    console.log('help');
    console.log(document.getElementById('content-circulate'));
    document.getElementById('content-circulate').style.display = 'none';
    document.getElementById('help-circulate').style.display = 'block';
  }

}
