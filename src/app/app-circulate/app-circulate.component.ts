import { Component, OnInit } from '@angular/core';
import {Project} from '../entity/Project';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-app-circulate',
  templateUrl: './app-circulate.component.html',
  styleUrls: ['./app-circulate.component.scss']
})
export class AppCirculateComponent implements OnInit {

  title = 'Scenario-basedRV-frontend';
  project: Project;
  projectName: string;
  projects: string[];
  currentProject: string;
  interval;
  versions: string[];

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
          const popLayer = document.getElementById('popLayer-circulate');
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
      const popLayer = document.getElementById('popLayer-circulate');
      popLayer.style.display = 'block';
      const popBox = document.getElementById('OpenProject-circulate');
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

    this.close('OpenProject-circulate');
  }

  close(id: string): void {
    // console.log(id)
    document.getElementById(id).style.display = 'none';
    document.getElementById('popLayer-circulate').style.display = 'none';
  }

  ngOnInit(): void {
  }

}
