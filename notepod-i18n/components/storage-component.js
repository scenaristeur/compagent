import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import  '../vendor/@lit-element-bootstrap/bs-list-group.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-form.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';
import { SolidFileHelper } from '../helpers/solid-file-helper.js';

import './visualization-component.js'

// Extend the LitElement base class
class StorageComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number},
      storage: {type: String},
      uri: {type: String},
      folder: { type: Object},
      file: {type: Object},
      webId: {type: String},
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
    this.storage = ""
    this.uri = ""
    this.webId = "fdsgf"
    this.folder = {folders: [], files: []}
    this.file = {uri:"",type:""}
    this.sfh = new SolidFileHelper()

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "storageChanged":
          // code block
          app.storageChanged(message.storage)
          break;
          case "sessionStorageChanged":
          app.sessionStorageChanged(message.storage)
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
  }



  sessionStorageChanged(storage){
    console.log("SESSION")
    this.sessionStorage = storage
  }

  render() {


    const folderList = (folder) => html`
    <h5>folders  (${folder.folders.length})  :</h5>
    <bs-input id="newFolderInput" placeholder="newFolderName" ></bs-input> <bs-button @click=${this.newFolder}>New Folder</bs-button><br>
    <bs-list-group>
    <bs-list-group-item active @click=${this.clickFolder} uri=${folder.parent}>.. (${folder.parent})</bs-list-group-item>

    ${folder.folders.map((f) => html`
      <bs-list-group-item @click=${this.clickFolder} uri=${f.url} >${f.name}</bs-list-group-item>
      <!--<button @click=${this.clickAcl} uri=${f.url} >acl</button> -->
      `)}
      </bs-list-group>
      `;


      const fileList = (files) => html`



      <h5>files (${files.length}) :</h5>

      <input id="newFileInput" placeholder="newfilename.ttl"></input>
      <button @click=${this.newFile} disabled>New File</button>
      <!--  <twit-component name="Twit" uri=${this.uri}></twit-component>
      <note-component name="Note" uri=${this.uri}></note-component>-->
      <bs-list-group>

      ${files.map((f) => html`
        ${this.isFileImage(f) ?
          html`
          <bs-list-group-item>
          <img src=${f.url} style='border:5px solid lightgray' width='50' height='50' @click=${this.clickFile} uri=${f.url} type=${f.type}>
          </bs-list-group-item>
          `
          : html`
          <bs-list-group-item @click=${this.clickFile} uri=${f.url} type=${f.type}>
          ${f.name}
          </bs-list-group-item>
          `
        }
        <!--<button @click=${this.clickAcl} uri=${f.url} >acl</button>-->
        `)}
        </bs-list-group>

        `;


        return html`

        <style>
        bs-card-img{
          max-width:33%
        }
        </style>

        <bs-card>
        <bs-card-img position="top" slot="top-image">
        <!--
        <img src="https://forum.solidproject.org/uploads/default/original/2X/1/17fa5b5c2a39024abe5a4daba5c4beae7ff9f01d.png" width="180px" height="180px" >
        -->
        <svg class="bd-placeholder-img"
        width="180" height="180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false" role="img"
        aria-label="Placeholder: Image cap"><title>Placeholder</title>
        <rect width="100%" height="100%" fill="#868e96">
        </rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>
        </svg>

        </bs-card-img>
        <h1>${this.name}</h1>
        <bs-card-body>
        <bs-card-title slot="card-title">
        <button @click=${this.clickFolder} uri=${this.sessionStorage} >${this.sessionStorage}</button>
        <h5>browser :</h5>
        ${this.storage}<br>
        ${this.uri}
        </bs-card-title>
        <bs-card-text slot="card-text">



        <bs-row>
        <bs-col>
        ${folderList(this.folder)}
        </bs-col>
        <bs-col>
        ${fileList(this.folder.files)}
        </bs-col>
        <bs-col>
        <visualization-component name="Visualization"></visualization-component>
        </bs-col>
        </bs-row>



        <!--  <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>-->
        <br>
        </bs-card-text>
        <bs-link-button disabled primary>Explore</bs-link-button>
        </bs-card-body>
        </bs-card>

        <!--  <p>${this.message}</p>
        <p>${this.count}</p>
        <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>-->
        `;
      }

      storageChanged(storage){
        console.log(storage)
        this.storage = storage
        this.exploreFolder(this.storage)
      }

      exploreFolder(uri){
        var app = this
        this.uri = uri
        console.log(this.uri)
        this.sfh.readFolder(this.uri)
        .then(
          folder => {
            if (folder.url != undefined){
              app.folder = folder
              var messageMeta = {action:"uriChanged", uri:uri}
              /*  app.agent.send('Acl', messageMeta);
              app.agent.send('Meta', messageMeta);
              app.agent.send('EditorTwit', messageMeta);
              app.agent.send('EditorNote', messageMeta);
              app.agent.send('Camera', messageMeta);*/
              var  messageSpoggy = {action: "updateFromFolder", folder:uri}
              app.agent.send('Spoggy', messageSpoggy);
              console.log("FOLDER",app.folder)
            }else{
              console.log("err folder ",folder)
            }
          }, err => {
            console.log(err)
          })

        }

        clickFolder(event) {
          var uri = event.target.getAttribute("uri");
          this.exploreFolder(uri)
        }

        clickFile(event) {
          var uri = event.target.getAttribute("uri");
          var type = event.target.getAttribute("type");
          this.file = {uri: uri,type:type}
          var message = {action:"fileChanged", file: this.file}
          console.log(message)
          this.agent.send('Visualization', message);

          //  this.agent.send('Image', message);
          /*var messageMeta = {action:"uriChanged", uri:uri}
          this.agent.send('Acl', messageMeta);
          this.agent.send('Meta', messageMeta);
          if(this.file.type == "unknown" || this.isFileImage(this.file)){
          this.agent.send('Image', messageMeta);
        }*/
      }

      newFolder(){
        var folderName = this.shadowRoot.getElementById("newFolderInput").value.trim()
        if (folderName.length >0){
          var uri = this.uri+folderName+"/"
          console.log(uri)
          this.sfh.createFolder(uri)
          .then(
            folder => {
              console.log("RESULT",folder)
              this.exploreFolder(uri)
            }, err => {
              console.log(err)
              alert("ERR2",err)
            })
          }else{
            alert ("You must define a foldername")
          }
        }


        isFileImage(file) {
          return file && file['type'].split('/')[0] === 'image';
        }



      }

      // Register the new element with the browser.
      customElements.define('storage-component', StorageComponent);
