import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
import { SolidFileHelper } from '../helpers/solid-file-helper.js';
//import { statements2vis } from '../helpers/import-export.js';

// Extend the LitElement base class
class EditorComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      body: {type: String},
      webId: {type: String},
      type: {type: String},
      //  uri: {type:String},
      folderPath: {type: String},
      fileName: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.type = "simple"
    this.folderPath = ""
    this.fineName = ""
    //  this.uri = ""
    this.sfh = new SolidFileHelper()

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "fileChanged":
          // code block
          app.fileChanged(message.file)
          break;
          case "folderUriChanged":
          // code block
          app.folderUriChanged(message.folder)
          break;
          case "uriChanged":
          // code block
          app.uriChanged(message.uri)
          break;
          case "sessionChanged":
          // code block
          app.sessionChanged(message.webId)
          break;
          case "setValue":
          // code block
          app.setValue(message.text)
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
  }

  render() {
    return html`

    <!--<h1>${this.name}</h1>-->
    <div>
    <input id="folderPath" placehoder="folderPath" value=${this.folderPath}>
    <input id="fileName" placehoder="fileName" value=${this.fileName}>
    <bs-button @click=${this.clickUpdate} primary >Save</bs-button>
    </div>
  <div>
  <textarea
    rows="20"
    cols="60"
    id="textarea"
    placeholder="type here text that you want to post"
    @change=${this.textareaChanged}>
    </textarea>
  </div>


  `;
}


uriChanged(uri){
  console.log(uri)
  this.uri = uri
  this.fileName = uri.substr(uri.lastIndexOf('/') + 1)
  this.folderPath = uri.substr(0,uri.lastIndexOf('/') + 1)
  console.log(this.folderPath,this.folderPath)
  //  this.uri = uri
}

fileChanged(file){
  var app = this
  this.uriChanged(file.uri)
  var extension = this.fileName.split('.').pop();
  switch (extension) {
    case 'json':
    case 'html':
    case 'ttl':
    case 'txt':
    case 'rdf':
    case 'owl':
    this.sfh.readFile(file.uri)
    .then(
      body => {
        app.body = body
        app.shadowRoot.getElementById("textarea").value = body
        console.log("File Body",app.body)
        file.content = body
        this.agent.send('Spoggy', {action:"updateFromFile", file:file });
      }, err => {
        console.log(err)
      })
      break;
      default:
      console.log("ce type de fichier n'est pas encore pris en compte : ",extension)
    }

  }

  folderUriChanged(folder){
    console.log("??? FOLDER",folder)
    this.folderPath = folder.substr(0,folder.lastIndexOf('/') + 1)

  }


  setValue(text){
    this.shadowRoot.getElementById("textarea").value = text
  }




  textareaChanged(event) {
    console.log("change")
    //  this.count++
    //console.log(event.target);
    //  console.log(this.agent)
    //  this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }

  sessionChanged(webId){
    this.webId = webId
    console.log(this.webId)
  }

  clickUpdate(){
    var app = this;
    var content = this.shadowRoot.getElementById("textarea").value.trim()
    var folderPath = this.shadowRoot.getElementById("folderPath").value.trim()
    var fileName = this.shadowRoot.getElementById("fileName").value.trim()

    var uri = folderPath+fileName;
    console.log("uri",uri)
    this.sfh.updateFile(uri, content)
    .then(
      success => {
        console.log( "Updated", uri, success)
        alert( "Updated", uri, success)
      }, err => {
        console.log(err)
        alert(err)
      })

    }
  }

  // Register the new element with the browser.
  customElements.define('editor-component', EditorComponent);
