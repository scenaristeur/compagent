import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import  '../vendor/@lit-element-bootstrap/bs-card.bundle.js';

// Extend the LitElement base class
class ProfileComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      webId: {type: String},
      username: {type: String},
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
        this.webId = null
            this.username = null

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
          case "langChanged":
          app.requestUpdate();
          break;
          case "usernameChanged":
          // code block
          app.usernameChanged(message.username)
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


</style>
    <bs-card>
        <bs-card-img position="top" slot="top-image">
            <svg class="bd-placeholder-img" width="180" height="180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Image cap"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>

        </bs-card-img>
<h1>${this.username}</h1>
        <bs-card-body>
            <bs-card-title slot="card-title">
                <h5>webId :</h5>
            </bs-card-title>
            <bs-card-text slot="card-text">
            <p><a href="${this.webId}" target="_blank">${this.webId}</a></p>
              <!--  <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>-->
              <br>
            </bs-card-text>
            <bs-link-button disabled primary>Détails</bs-link-button>
        </bs-card-body>
    </bs-card>


  <!--
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>-->
    `;
  }

  sessionChanged(webId){
    console.log("SESSION")
    this.webId = webId
  }

  usernameChanged(username){
    this.username = username
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }
}

// Register the new element with the browser.
customElements.define('profile-component', ProfileComponent);
