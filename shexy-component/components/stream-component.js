import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class StreamComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "doSomething":
          app.doSomething(message.params)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };

    const constraints = {
      video: true
    };

    const video = this.shadowRoot.querySelector('video');

    navigator.mediaDevices.getUserMedia(constraints).
      then((stream) => {video.srcObject = stream});

  }

  doSomething(params){
    console.log(params)
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }

  render() {
    return html`
    <h1>${this.name}</h1>
    <p>${this.message}</p>
    <p>${this.count}</p>
    <video autoplay></video>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    `;
  }

}

// Register the new element with the browser.
customElements.define('stream-component', StreamComponent);
