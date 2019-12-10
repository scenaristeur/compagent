import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';



import './messages-component.js'
import './login-component.js'
import './webid-component.js'
import './i18n-component.js'
import './profile-component.js'
import './friends-component.js'
import './storage-component.js'
import './notepod-component.js'
import './agora-notes-component.js'
import './annonce-component.js'
import './agora-annonce-component.js'

import './shexy-component.js'


// Extend the LitElement base class
class AppComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      webId: {type: String},
      count: {type: Number},
      tools: {type: Array}
    };
  }

  constructor() {
    super();
    this.message = 'If you want to post, you must login';
    this.name = "unknown"
    this.webId = null
    this.count = 0;
    this.tools = [
      {name: "Solid File Manager", url:"https://otto-aa.github.io/solid-filemanager/"},
      {name: "Solid-Ide", url:"https://jeff-zucker.github.io/solid-ide/"},
      {name: "Pod-Explorer", url:"https://nmalcev.github.io/pod-explorer/"},
      {name: "Spoggy-simple", url:"https://scenaristeur.github.io/spoggy-simple/?source=https://holacratie.solid.community/public/Schema"},
      {name: "Shexy-lit", url:"https://scenaristeur.github.io/spoggy-simple/shexy/shexy-lit/index.html"},
      {name: "Solidash", url:"https://scenaristeur.github.io/solidash/"},
      {name: "xls to rdf", url:"https://scenaristeur.github.io/spoggy-simple/js-xlsx/"},
    ]
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
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
  }


  sessionChanged(webId){
    this.webId = webId
  }


  clickMenu(event) {
    var url = event.target.getAttribute("url");
    console.log(url)
    window.open('url', '_blank');
  }
  clickDropdown(){
    console.log("click")
    $('.dropdown-toggle').dropdown()
  }

  render() {
/*
    const toolsList = (tools) => html`
    ${tools.map((n) => html`
      <bs-nav-item>
      <bs-dropdown-item-link dropdown-toggle @click="this.clickMenu" href="${n.url}" target="_blank"  title="${n.name}" ></bs-dropdown-item-link>
      <!--<bs-link-button primary small href="${n.url}" target="_blank">${n.name}</bs-link-button>-->
      </bs-nav-item>
      `)}

      `;*/

      return html`
      <link href="./vendor/fontawesome/css/all.css" rel="stylesheet">
      <link href="./vendor/bootstrap-4/css/bootstrap.min.css" rel="stylesheet">
      <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
      <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="#" >Link</a>
      </li>
      <li class="nav-item dropdown" @click="this.clickDropdown">
      <a class="nav-link dropdown-toggle"  href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Dropdown
      </a>
      <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a class="dropdown-item" href="#">Action</a>
      <a class="dropdown-item" href="#">Another action</a>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item" href="#">Something else here</a>
      </div>
      </li>
      <li class="nav-item">
      <a class="nav-link disabled" href="#">Disabled</a>
      </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
      </div>
      </nav>


<button @click="this.clickMenu">buttton</button>

      </div>
      `;
    }

  }

  // Register the new element with the browser.
  customElements.define('app-component', AppComponent);
