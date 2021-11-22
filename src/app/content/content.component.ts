import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { CCSLSet } from '../entity/CCSLSet';
import { Project } from '../entity/Project';
import { FileService } from '../service/file.service';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  project: Project;
  projectName: string;
  composedCcslFlag: false;
  ccslSetList: CCSLSet[];
  CGs: string[] = [];
  ccslFlag: boolean = false;
  version;

  constructor(
    private fileService: FileService,
    private projectService: ProjectService,
  ) {
    projectService.changeProjectEmitted$.subscribe(
      project => {
        this.project = project;
        console.log(this.project)
        this.projectName = project.title;
        if (this.project.ccslSetList != null) {
          this.ccslSetList = this.project.ccslSetList;
          this.ccslFlag = true;
          if (this.CGs.length != this.ccslSetList.length) {
            for (let i = 0; i < this.ccslSetList.length; i++) {
              this.CGs.push("CG-" + (i + 1));
            }
          }
          // console.log(this.CGs)
          // console.log(this.ccslSetList)

        }
      })
    fileService.sendVersionEmmited$.subscribe(
      version => {
        // console.log(version)
        this.version = version;
      })
  }

  ngOnInit(): void {
  }

  uploadFile() {
    if (!this.project) {
      alert("Please create or open a project first!")
    } else {
      this.fileService.getScenarioDiagrams().subscribe(
        project => {
          console.log(project);
        })
    }
  }
  sdToCCSL() {
    if (!this.project) {
      alert("Please create or open a project first!")
    } else if (this.project.scenarioGraphList.length <= 0) {
      alert("Please upload the scenario diagrams first!")
    } else {
      this.projectService.sdToCCSL(this.project).subscribe(
        ccsls => {
          console.log(ccsls);
          this.project.ccslSetList = ccsls;
          // console.log(this.project)
          this.projectService.sendProject(this.project);
        })
    }
  }
  // 组合
  CCSLComposition() {
    // console.log(this.project);
    if (!this.project) {
      alert("Please create or open a project first!")
    } else if (this.project.ccslSetList == null) {
      alert("Please transform the sequence diagrams into CCSL constraints first!")
    } else {
      this.projectService.CCSLComposition(this.project).subscribe(
        ccslConstraints => {
          console.log(ccslConstraints);
          this.project.composedCcslSet = ccslConstraints;
          this.projectService.sendProject(this.project);
        })
    }

  }

  // 化简
  CCSLSimplify() {
    // console.log(this.project);
    if (!this.project) {
      alert("Please create or open a project first!")
    } else if (this.project.composedCcslSet == null) {
      alert("Please compose CCSL constraints first!")
    } else {
      this.projectService.CCSLSimplify(this.project).subscribe(
        ccslSet => {
          console.log(ccslSet);
          this.project.simplifiedCcslSet = ccslSet;
          this.projectService.sendProject(this.project);
        })
    }
  }

  // 编排
  CCSLOrchestrate() {
    console.log(this.project);
    if (!this.project) {
      alert("Please create or open a project first!")
    } else if (this.project.simplifiedCcslSet == null) {
      alert("Please simplify CCSL constraints first!")
    } else {
      this.projectService.CCSLOrchestrate(this.project).subscribe(
        ccslSet => {
          console.log(ccslSet);
          this.project.orchestrateCcslSet = ccslSet;
          this.projectService.sendProject(this.project);
        })
    }
  }

  change(title: string) {
    console.log(title + "-P")
    let parTab;
    if (!title.startsWith("Composed")) {
      parTab = document.getElementById(title).parentElement.parentElement;
      // console.log(parTab)
    } else {
      parTab = document.getElementById("composedCCSL").parentElement;
      // console.log(parTab)
    }
    var tabs = parTab.children;
    // console.log(tabs)
    var cgTitle = title.replace("CCSL", "CG");
    console.log(cgTitle)


    for (var i = 0; i <= tabs.length; i++) {
      if (tabs[i] != undefined) {
        var ctabs = tabs[i].children;
        for (var j = 0; j < ctabs.length; j++) {
          // console.log(ctabs[j]);
          var id = ctabs[j].getAttribute('id');
          // console.log(id)
          document.getElementById(id + "-P").style.display = 'none';
          var cgId = id.replace("CCSL", "CG")
          // console.log(cgId)
          document.getElementById(cgId + "-P").style.display = 'none';
          // if (this.project.composedCcslSet != null) {
          //   document.getElementById("ComposedCCSL-P").style.display = 'none';
          //   document.getElementById("ComposedCG-P").style.display = 'none';
          // }
        }
      }
    }

    // console.log(document.getElementById(title + "-P"))
    document.getElementById(title + "-P").style.display = 'block';
    document.getElementById(cgTitle + "-P").style.display = 'block';

    var time = (new Date()).getTime();
    var userName = this.projectService.getUserName();

    var url = `http://localhost:8071/project/display?userName=${userName}&projectName=${this.projectName}&version=${this.version}&fileName=${cgTitle}&time=${time}`;
    console.log(url);
    var ID = cgTitle + "-Pag"
    console.log(ID);
    console.log(document.getElementById(ID));
    // console.log($(ID));
    // $(ID).attr("src", url);
    document.getElementById(ID).setAttribute("src", url);

    document.getElementById("ccslText").innerHTML = "CCSL constraints:";
    document.getElementById("cgsText").innerHTML = "Clock graph:";
    var ccslText = document.getElementById("ccslText").innerHTML;
    var newCcslText = null;
    if (title.startsWith("CCSL")) {
      newCcslText = ccslText.slice(0, 16) + " of scenario diagram " + title.split("CCSL-")[1] + ccslText.slice(16);
    } else if (title.startsWith("Composed")) {
      newCcslText = "Composed " + ccslText;
    } else if (title.startsWith("Sub")) {
      newCcslText = ccslText.slice(0, 16) + " of scenario " + title.split("CCSL-")[1] + ccslText.slice(16);
    }
    console.log(newCcslText)
    document.getElementById("ccslText").innerHTML = newCcslText;
    var cgsText = document.getElementById("cgsText").innerHTML;
    var newCgsText = cgsText.slice(0, 11) + " of " + title.replace("CCSL", "CG") + cgsText.slice(11);
    console.log(newCgsText);
    document.getElementById("cgsText").innerHTML = newCgsText;
  }

  setHeight(ccslSetList: CCSLSet[]) {
    // console.log(ccslSetList)
    if (ccslSetList.length > 0) {
      let parTab = document.getElementById(ccslSetList[0].id).parentElement;
      // console.log(parTab)
      // parTab.setAttribute("height", 30 * (ccslSetList.length + 1) + "px !important");
      parTab.style.height = 30 * (ccslSetList.length + 1) + "px";
    }
  }

  resetHeight(ccslSetList: CCSLSet[]) {
    if (ccslSetList.length > 0) {
      let parTab = document.getElementById(ccslSetList[0].id).parentElement;
      // console.log(parTab)
      // parTab.setAttribute("height", "30px");
      parTab.style.height = "30px";
    }
  }

  resizeimg(ID: string, event) {
    // console.log(ID);
    var img = document.getElementById(ID + "-Pag")
    // console.log(img);
    var zoom = parseInt(img.style.zoom, 10) || 100;
    zoom += event.wheelDelta / 12;
    if (zoom > 0) img.style.zoom = zoom + '%';
    return false;
  }
}
