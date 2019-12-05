import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import './messages-component.js'
import './login-component.js'

// Extend the LitElement base class
class AppComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.message = 'If you want to post, you must login';
    this.name = "unknown"
    this.count = 0;
    this.webId = null

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "sessionChanged":
          // code block
          app.sessionChanged(message.webId)
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
    <style>
    :host {
      height: 100%
    }
    .header {
      height: 10vh;
      margin-bottom: 0.5rem;
      background-color: #eee;
      border-radius: 0.25rem;
    }

    .sidebar {
      float: right;
      width: 4rem;
      height: 8rem;
      background-color: #80bdff;
      border-radius: 0.25rem;
    }

    .body {
      height: 50vh;
      margin-right: 4.5rem;
      background-color: #eee;
      border-radius: 0.25rem;
    }
    .footer {
      height: 10vh;
      margin-top: 0.5rem;
      background-color: #eee;
      border-radius: 0.25rem;
    }

    </style>





    <bs-container fluid>
    <div class="header">
    <login-component name="Login"></login-component>
    </div>
    <div class="sidebar">side</div>
    <div class="body">

    ${this.webId != null ?
      html `
      <p> ${this.webId}</p>
      <br>
      <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>

      `
      :html `${this.message}`

    }



    </div>
    <div class="footer">
    foot
    </div>
    </bs-container>

    <messages-component name="Messages"></messages-components>


    <div>

    </div>




    `;
  }

  sessionChanged(webId){
    this.webId = webId
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    //  console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }
}

// Register the new element with the browser.
customElements.define('app-component', AppComponent);
