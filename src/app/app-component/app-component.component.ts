import { Component, OnInit } from '@angular/core';
import {Project} from '../entity/Project';
import {FileService} from '../service/file.service';
import {ProjectService} from '../service/project.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-app-component',
  templateUrl: './app-component.component.html',
  styleUrls: ['./app-component.component.scss']
})
export class AppComponentComponent implements OnInit {

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
          const popLayer = document.getElementById('popLayer');
          popLayer.style.display = 'block';
          const ele = document.getElementById('projectPopBox');
          ele.style.display = 'block';
        }
      });
  }

  // new project
  confirmNewProject(): void {
    document.getElementById('projectPopBox').style.display = 'none';
    document.getElementById('popLayer').style.display = 'none';
    const selectedDiv = document.getElementById('projectPopBox');
    const description = (selectedDiv.getElementsByClassName('description')[0] as any).value;
    if (description === '') {
      alert('The project name cannot be empty!');
    } else if (description.indexOf(' ') !== -1) {
      alert('The project title can\'t contains space!');
    } else {
      // 判断是否有重名项目
      let flag = false;
      this.fileService.searchProject().subscribe(
        projects => {
          console.log(projects);
          for (const pro of projects) {
            if (pro === description) {
              alert(description + ' 已存在！');
              flag = true;
              break;
            }
          }
          if (!flag) {
            // console.log("New project.")
            // this.projectService.register(description, "undefined");
            this.projectService.initProject(description);
            this.closePopEdit();
          }
        }
      );
    }
  }

  getProjects(projects: string[]): void {
    // console.log("appopen");
    this.projects = projects;
    // console.log(projects.length);
    if (projects.length === 0) {
      alert('目前还没有任何项目！你需要导入一个新的项目！');
    } else {
      const popLayer = document.getElementById('popLayer');
      popLayer.style.display = 'block';
      const popBox = document.getElementById('OpenProject');
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

    this.close('OpenProject');
  }

  close(id: string): void {
    // console.log(id)
    document.getElementById(id).style.display = 'none';
    document.getElementById('popLayer').style.display = 'none';
  }

  closeBox(): void {
    this.closePopEdit();
  }

  closePopEdit(): void {
    document.getElementById('projectPopBox').style.display = 'none';
    document.getElementById('popLayer').style.display = 'none';
  }

  ngOnInit(): void {
  }
}
