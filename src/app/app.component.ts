import { Component } from '@angular/core';
import { Project } from './entity/Project';
import { FileService } from './service/file.service';
import { ProjectService } from './service/project.service';
import * as $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
      })
    fileService.newProEmmited$.subscribe(
      res => {
        // console.log(res);
        if (res == true) {
          let popLayer = document.getElementById('popLayer');
          popLayer.style.display = "block";
          let ele = document.getElementById('projectPopBox');
          ele.style.display = "block";
        }
      })
  }

  //new project
  confirmNewProject() {
    document.getElementById("projectPopBox").style.display = "none";
    document.getElementById("popLayer").style.display = "none";
    let selectedDiv = document.getElementById('projectPopBox');
    let description = (selectedDiv.getElementsByClassName("description")[0] as any).value;
    if (description == "") {
      alert("The project name cannot be empty!");
    } else if (description.indexOf(" ") != -1) {
      alert("The project title can't contains space!");
    } else {
      //判断是否有重名项目
      let flag = false
      this.fileService.searchProject().subscribe(
        projects => {
          console.log(projects)
          for (let pro of projects) {
            if (pro == description) {
              alert(description + " already exist!")
              flag = true
              break
            }
          }
          if (!flag) {
            // console.log("New project.")
            // this.projectService.register(description, "undefined");
            this.projectService.initProject(description);
            this.closePopEdit();
          }
        }
      )
    }
  }

  getProjects(projects: string[]) {
    //console.log("appopen");
    this.projects = projects;
    //console.log(projects.length);
    if (projects.length == 0) {
      alert("There is no project! You need import a new project!");
    } else {
      var popLayer = document.getElementById("popLayer");
      popLayer.style.display = "block";
      var popBox = document.getElementById('OpenProject');
      popBox.style.display = "block";
    }
  }

  search(project: string) {
    this.currentProject = project;
    //console.log(project);
    this.fileService.searchVersion(project).subscribe(
      versions => {
        // console.log(versions)
        this.versions = versions;
      }
    )
  }

  //chose project to open
  open() {
    // var form = document.getElementById('version');
    // console.log(form.textContent);
    console.log(this.currentProject)
    var version = $("input[id='version']:checked").val()
    if (this.currentProject != undefined) {
      // window.location.assign('/' + this.project)
      var that = this
      that.interval = setInterval(function () {
        clearInterval(that.interval)
        that.projectService.getProject(that.currentProject, version)
        console.log('this.project')
        console.log(that.currentProject)
        console.log('version')
        console.log(version)
        that.fileService.sendVersion(version);
      }, 500)
    }

    this.close('OpenProject');
  }

  close(id: string) {
    // console.log(id)
    document.getElementById(id).style.display = "none"
    document.getElementById("popLayer").style.display = "none"
  }

  closeBox() {
    this.closePopEdit();
  }

  closePopEdit() {
    document.getElementById("projectPopBox").style.display = "none";
    document.getElementById("popLayer").style.display = "none";
  }
}
