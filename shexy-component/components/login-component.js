import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
import  '../vendor/solid-auth/solid-auth-client.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';

import './i18n-component.js'

// Extend the LitElement base class
class LoginComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      logged: {type: Boolean},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.webId = null
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "langChanged":
          //  app.lang = message.lang;
          app.requestUpdate();
          break;
          case "doSomething":
          // code block
          app.doSomething(message.params)
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };


    solid.auth.trackSession(session => {

        if (!session){
          //  this.switchLogButtons(null)
          app.logged = false
          //  slog("not logged")
          console.log("notlogged")
          app.informAllAgents(null)
        }
        else{
          app.logged = true
          //  this.switchLogButtons(session)
          //  slog("user is "+session.webId)
          console.log("user is "+session.webId)
          app.informAllAgents(session)
        }
      
    })

  }

  render() {
    return html`
    ${this.logged ?
      html`
      <bs-button warning @click=${this.logout}>${i18next.t('logout')}</bs-button>`
      : html`<bs-button success @click=${this.login}>${i18next.t('login')}</bs-button>`
    }
    `;
  }

  login(event) {
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', 'Login');
    this.popupLogin();
  }
  logout(event) {
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', 'Logout');
    solid.auth.logout()
    .then(() => alert('Goodbye!'));
  }

  async popupLogin() {
    let session = await solid.auth.currentSession();
    let popupUri = '../dist-popup/popup.html';
    if (!session)
    session = await solid.auth.popupLogin({ popupUri });
  }

  informAllAgents(session){
    var app = this;
    this.webId = session == null ? null : session.webId;
    var allAgents = Object.keys(app.agent.connections[0].transport.agents);
    console.log(allAgents)
    allAgents.forEach(function (agent){
      app.agent.send(agent, {action: "sessionChanged", webId: app.webId});
    })
  }

}

// Register the new element with the browser.
customElements.define('login-component', LoginComponent);
