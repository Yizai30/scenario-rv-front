import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as jQuery from 'jquery';
import { FileUploader } from 'ng2-file-upload';
import { Project } from '../entity/Project';
import { FileService } from '../service/file.service';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Output() openEvent = new EventEmitter<string[]>();

  userName: string;
  project: Project;
  projectName: string;
  fileList: Array<string> = [];
  ontologyName: string;
  interval;
  interval1;
  ontologyFlag: boolean = false;
  scenarioDiagramsFlag: boolean = false;
  projects: string[];

  uploader: FileUploader = new FileUploader({
    method: "POST",
    itemAlias: "xmlFile",
    autoUpload: false,
  });

  constructor(
    private fileService: FileService,
    private projectService: ProjectService,
  ) {
    if (document.cookie != '') {
      // document.cookie的读取存在问题
      // this.userName = jQuery.parseJSON(document.cookie)['username']
      console.log("topbar username:" + document.cookie['username'])
      this.userName = document.cookie['username'];
    } else {
      this.userName = "Not Login"
    }

    projectService.changeProjectEmitted$.subscribe(
      project => {
        this.project = project;
        this.projectName = project.title;
      });
  }

  ngOnInit(): void {
  }

  newFile(): void {
    document.getElementById("help").style.display = "none";
    document.getElementById("content").style.display = "block";
    this.fileService.newProject(true);
  }

  uploadFile() {
    document.getElementById("help").style.display = "none";
    document.getElementById("content").style.display = "block";
    this.uploader.clearQueue();
    //若未创建项目，或当前项目为空项目，提示不能上传用户，否则允许用户上传
    if (this.projectName == null) {
      alert('Please create a new project before uploading the xml file!');
    } else {
      document.getElementById("xmlFile").click();
    }
  }

  selectedFileOnChanged(event: any) {
    // console.log("selectedOWLOnChanged");
    console.log('即将调用upload!');
    // 上传文件
    this.upload();
  }

  // 上传情景图xml文件
  upload() {
    if (!this.project) {
      alert("Please create a new project first!")
    } else {
      this.fileService.setProject(this.projectName).subscribe(
        res => {
          // console.log(res);
          if (res === true) {
            // console.log(this.uploader)
            var that = this;
            that.fileService.uploadFile(that.uploader)
            that.uploader.onCompleteAll = function() {
              console.info('onCompleteAll');
              that.interval = setInterval(function () {
                clearInterval(that.interval);
                // 解析xml文件得到情景图对象
                that.fileService.getScenarioDiagrams().subscribe(
                  project => {
                    // console.log(project);
                    that.project.contextDiagram = project.contextDiagram;
                    that.project.problemDiagram = project.problemDiagram;
                    that.project.scenarioGraphList = project.scenarioGraphList;
                    that.scenarioDiagramsFlag = true;
                    alert('The scenario diagrams were imported successfully!');
                    console.log(that.project)
                    // // 将情景图转换为CCSL约束
                    // that.projectService.sdToCCSL(that.project).subscribe(
                    //   ccsls => {
                    //     // console.log(ccsls);
                    //     that.project.ccslSetList = ccsls;
                    //     console.log(that.project)
                    //     that.projectService.sendProject(that.project);
                    //   })
                  });
              }, 1500);
            }; 
          } else {
            alert('The project already exists!');
          }
        }
      );
    }
  }

  uploadOntology() {
    //若未创建项目，或当前项目为空项目，提示不能上传用户，否则允许用户上传
    document.getElementById("help").style.display = "none";
    document.getElementById("content").style.display = "block";
    this.uploader.clearQueue();
    if (this.projectName == null) {
      alert('Please create a new project before uploading the owl file!');
    } else {
      document.getElementById("ontologyFile").click();
    }
  }

  // 上传owl文件的隐藏事件
  // 通过点击Ontology-Eontology-Upload，在已创建项目,或当前项目不为空项目的时候触发
  selectedOWLOnChanged(event: any) {
    var path = event.target.files[0].name;
    this.ontologyName = path.split('.')[0];
    console.log(this.ontologyName);
    // this.projectService.sendProject(this.project);
    console.log('即将调用uploadOWL!');
    // 上传文件
    this.uploadOWL();
  }

  // 上传环境本体owl文件
  uploadOWL() {
    if (!this.project) {
      alert("Please create a new project first!")
    } else {
      this.fileService.setProject(this.projectName).subscribe(
        res => {
          console.log(res);
          // if (res === true) {
            console.log(this.uploader)
            var that = this;
            that.fileService.uploadFile(that.uploader);
            that.uploader.onCompleteAll = function() {
              console.info('onCompleteOntology');
              that.interval = setInterval(function () {
                clearInterval(that.interval);
                // 解析owl文件得到环境本体对象
                that.fileService.getOntology(that.ontologyName).subscribe(
                  ontology => {
                    // console.log(ontology);
                    that.project.ontology = ontology;
                    that.ontologyFlag = true;
                    alert('The ontology was imported successfully!');
                    console.log(that.project)
                    that.projectService.sendProject(that.project);
                  });
              }, 1500);
            }
          // } else {
          //   alert('The project already exists!');
          // }
        }
      );
    }
  }

  saveProject() {
    document.getElementById("help").style.display = "none";
    document.getElementById("content").style.display = "block";
    var result: boolean;
    console.log(this.project)
    if (this.project.title == null) {
      alert("The project is empty!");
      return
    }
    this.projectName = this.project.title;
    this.fileService.saveProject(this.projectName, this.project).subscribe(
      res => {
        result = res;
        if(result){
					alert("Save successfully!");
				}else{
					alert("Save failed!");
				}
      }
    );
  }

  openProject() {
    document.getElementById("help").style.display = "none";
    document.getElementById("content").style.display = "block";
    this.fileService.searchProject().subscribe(
      projects => {
        this.projects = projects
        console.log(this.projects)
        this.openEvent.emit(projects)
      }
    )
  }

  sdToCCSL(){
    // console.log(this.project)
    // 将情景图转换为CCSL约束
    this.projectService.sdToCCSL(this.project).subscribe(
      ccsls => {
        console.log(ccsls);
        // this.project.ccslSetList = ccsls;
      })
  }

  help(){
    console.log("help")
    console.log(document.getElementById("content"))
    document.getElementById("content").style.display = "none";
    document.getElementById("help").style.display = "block";
  }
}
