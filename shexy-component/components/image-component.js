import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class ImageComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      file: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.file = {};

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "fileChanged":
          // code block
          console.log(message)
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
    <!--    <h1>${this.name}</h1>
    uri  ${this.file.uri}, type: ${this.file.type}-->
    ${this.file.uri != undefined ?
      html`
      <a href="${this.file.uri}" target="_blank">
      <img src=${this.file.uri} style='border:5px solid lightgray;max-width:400;max-height=400'>
      </a>
      `
      : html`<p> Here must show the image ${this.file.uri}</p>`
    }

    `;
  }

  fileChanged(file){
    console.log(file)
    this.file = file
  }

}

// Register the new element with the browser.
customElements.define('image-component', ImageComponent);
