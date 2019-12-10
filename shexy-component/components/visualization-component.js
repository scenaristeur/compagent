import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import "./image-component.js"
import "./editor-component.js"
import "./spoggy-component.js"

// Extend the LitElement base class
class VisualizationComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      file: {type: Object},
      fileType: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.file = {uri:"",type:""}
    this.fileType = ""
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
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
  }

  render() {
    return html`
    <!--  <h1>${this.name}</h1>
    <p> ${this.file.uri} de type  ${this.file.type} , fileType: (${this.fileType})</p>
    -->
    <h5>Visualization</h5>

    <image-component name="Image" ?hidden=${this.fileType != 'image'}></image-component>
    <editor-component name="Editor" type="simple" ?hidden=${this.fileType != 'text'}></editor-component>
    <spoggy-component name="Spoggy" ></spoggy-component>

    <span ?hidden=${this.fileType != 'unknown'}>No visualization module for type ${this.fileType}</span>
    `;
  }

  fileChanged(file){
    console.log(file)
    this.isFileImage(file)
    this.file = file
    var message = {action:"fileChanged", file: this.file}
    this.agent.send('Image', message);
    this.agent.send('Editor', message);
    this.agent.send('Spoggy', message);
  }


  isFileImage(file) {
    var fileType = file['type'].split('/')[0];
    if(fileType == 'unknown'){
      var extension = file.uri.split('.').pop();
      switch (extension) {
        case 'jpg':
        case 'bmp':
        case 'jpeg':
        case 'ico':
        case 'gif':
        case 'png':
        case 'svg':
        case 'tga':
        case 'img':
        case 'tiff':
        case 'jpg':
        fileType = "image"
        break;

        case 'json':
        case 'html':
        case 'ttl':
        case 'txt':
        case 'rdf':
        case 'owl':
        fileType = "text"
        break;
        default:
        fileType = extension
      }
    }

    this.fileType = fileType
    return file && fileType === 'image';
  }

}

// Register the new element with the browser.
customElements.define('visualization-component', VisualizationComponent);
