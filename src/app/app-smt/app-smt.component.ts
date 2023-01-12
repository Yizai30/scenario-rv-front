import { Component, OnInit } from '@angular/core';
import {Project} from '../entity/Project';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-app-smt',
  templateUrl: './app-smt.component.html',
  styleUrls: ['./app-smt.component.scss']
})
export class AppSmtComponent implements OnInit {

  title = 'Scenario-basedRV-frontend';
  project: Project;
  projectName: string;
  projects: string[];
  currentProject: string;
  interval;
  versions: string[];

  // smt check params
  timeout = 0;
  bound = 0;
  period = false;
  pv = 0;
  deadlock = false;

  constructor(
    private fileService: FileService,
    private projectService: ProjectService,
  ) {
    projectService.changeProjectEmitted$.subscribe(
      project => {
        // console.log(project)
        this.projectName = project.title;
        this.project = project;
      });
    fileService.newProEmmited$.subscribe(
      res => {
        // console.log(res);
        if (res === true) {
          const popLayer = document.getElementById('popLayer-smt');
          popLayer.style.display = 'block';
        }
      });
  }

  getProjects(projects: string[]): void {
    // console.log("appopen");
    this.projects = projects;
    // console.log(projects.length);
    if (projects.length === 0) {
      alert('目前还没有任何项目！你需要导入一个新的项目！');
    } else {
      const popLayer = document.getElementById('popLayer-smt');
      popLayer.style.display = 'block';
      const popBox = document.getElementById('OpenProject-smt');
      popBox.style.display = 'block';
    }
  }

  search(project: string): void {
    this.currentProject = project;
    // console.log(project);
    this.fileService.searchVersion(project).subscribe(
      versions => {
        // console.log(versions)
        this.versions = versions;
      }
    );
  }

  // chose project to open
  open(): void {
    // var form = document.getElementById('version');
    // console.log(form.textContent);
    console.log(this.currentProject);
    const version = $('input[id=\'version\']:checked').val();
    if (this.currentProject !== undefined) {
      // window.location.assign('/' + this.project)
      const that = this;
      // tslint:disable-next-line:only-arrow-functions
      that.interval = setInterval(function(): void {
        clearInterval(that.interval);
        that.projectService.getProject(that.currentProject, version);
        console.log('this.project');
        console.log(that.currentProject);
        console.log('version');
        console.log(version);
        that.fileService.sendVersion(version);
      }, 500);
    }

    this.close('OpenProject-smt');
  }

  close(id: string): void {
    // console.log(id)
    document.getElementById(id).style.display = 'none';
    document.getElementById('popLayer-smt').style.display = 'none';
  }

  // setSMTInformation
  setSMTInfo(): void {
    const TimeOut = $('input[id=\'TimeOut\']').val();
    const Bound = $('input[id=\'Bound\']').val();
    const Period = $('input[id=\'Period\']').eq(0).is(':checked');
    const PeriodValue = $('input[id=\'PeriodValue\']').val();
    const Deadlock = $('input[id=\'Deadlock\']').eq(0).is(':checked');
    console.log(TimeOut);
    console.log(Bound);
    console.log(Period);
    console.log(PeriodValue);
    console.log(Deadlock);
    this.close('SMTCheck');
    // let userName = '';
    // if (document.cookie !== ''){
    //   console.log(document.cookie);
    //   // userName = jQuery.parseJSON(document.cookie)['username']
    //   const userInfo = document.cookie.slice(document.cookie.indexOf('{'), document.cookie.indexOf('}') + 1);
    //   // userName = JSON.parse(userInfo)['username'];
    //   // userName = getCookie('username');
    // }
    // if (userName === '') {
    //   userName = 'test';
    // }
    console.time('smt-time');
    this.projectService.smtCheck(this.project, Number(TimeOut), Number(Bound), Period, Number(PeriodValue), Deadlock).subscribe( results => {
      this.project.smtRes = results;
      console.log(results);
      document.getElementById('smtResName').style.display = 'block';
      document.getElementById('smt-locate-result').style.display = 'none';
      document.getElementById('cgsText-smt').innerText = '验证结果：';
      document.getElementById('smtResName').innerText = results.name;
      document.getElementById('smt-res-result').innerText = results.res;
      console.timeEnd('smt-time');
    });
  }

  ngOnInit(): void {
  }

}
