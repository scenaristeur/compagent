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
import './picpost-component.js'
//import './agora-picpost-component.js'

import './shexy-component.js'

import  '../vendor/@lit-element-bootstrap/bs-navbar.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-nav.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-dropdown.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-form.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-jumbotron.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-layout.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-collapse.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';



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

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    //  console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }

  clickMenu(event) {
    var url = event.target.getAttribute("url");
    console.log(url)
    window.open('url', '_blank');
  }

  render() {



    const toolsList = (tools) => html`




    ${tools.map((n) => html`
      <bs-nav-item>
      <bs-dropdown-item-link dropdown-toggle @click="this.clickMenu" href="${n.url}" target="_blank"  title="${n.name}" ></bs-dropdown-item-link>
      <!--<bs-link-button primary small href="${n.url}" target="_blank">${n.name}</bs-link-button>-->
      </bs-nav-item>
      `)}






      `;

      return html`
      <style>
      :host {
        height: 100%
      }

      .footer {
        height: 10vh;

        margin-top: 0.5rem;
        background-color: #eee;
        border-radius: 0.25rem;
      }
      bs-navbar-collapse {
        background-color: #ddd;
      }
      .display-4 {
        font-size: 3.5rem;
        font-weight: 300;
        line-height: 1.2;
      }
      .lead {
        font-size: 1.25rem;
        font-weight: 300;
      }
      .mb-4, .my-4 {
        margin-bottom: 1.5rem !important;
      }

      bs-container {
        /*  width: 87vw; */
      }

      bs-column[demo] {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        background-color: rgba(86, 61, 124, 0.15);
        border-width: 1px;
        border-style: solid;
        border-color: rgba(86, 61, 124, 0.2);
        border-image: initial;
      }




      </style>

      <webid-component name="Webid"></webid-component>
      <bs-container >

      <bs-navbar navbar-light expand-lg class="bg-light">
      <bs-navbar-brand-link>Poddy</bs-navbar-brand-link>
      <i18n-component name="I18n"></i18n-component>
      <bs-navbar-toggler>
      <bs-navbar-toggler-icon></bs-navbar-toggler-icon>
      </bs-navbar-toggler>
      <bs-navbar-collapse>
      <bs-navbar-nav class="mr-auto">
      <bs-nav-item>
      <bs-nav-link active>
      ${i18next.t('home')}
      </bs-nav-link>
      </bs-nav-item>
      <!--
      <a href="#notepod">Notepod</a>
      <bs-nav-item><bs-nav-link><a href="#notepod">Notepod</a></bs-nav-link></bs-nav-item>
      <bs-nav-item><bs-nav-link><a href="#agoranotes">Agora Notes</a></bs-nav-link></bs-nav-item>
      -->

      ${toolsList(this.tools)}


      <!--   <bs-nav-item>
      <bs-nav-link disabled>Disabled</bs-nav-link>

      </bs-nav-item>
      -->

      </bs-navbar-nav>

      <bs-form inline class="my-2 my-lg-0">
      <bs-form-input class="mr-sm-2" type="search" placeholder="Search"></bs-form-input>
      <bs-button class="my-2 my-sm-0" outline-success action="submit">Search</bs-button>
      </bs-form>
      <bs-nav-item>
      <login-component name="Login"></login-component>
      </bs-nav-item>
      <bs-nav-item>

      </bs-nav-item>
      </bs-navbar-collapse>

      </bs-navbar>
      </bs-container>

      <bs-container >


      <bs-jumbotron >
      <h1 class="display-4">${i18next.t('hello_world')}</h1>

      <p class="lead">${i18next.t('info_app1')}</p>
      <hr class="my-4">










      <p>  ${this.webId != null ?
        html `



        <!--
        <p>
        <bs-collapse-toggle target="multiCollapseExample1">
        <bs-link-button primary>Profile</bs-link-button>
        </bs-collapse-toggle>
        <bs-collapse-toggle target="multiCollapseExample2">
        <bs-button primary>Friends</bs-button>
        </bs-collapse-toggle>
        <bs-collapse-toggle target="multiCollapseExample3">
        <bs-button primary>Storage</bs-button>
        </bs-collapse-toggle>
        <bs-collapse-multi-toggle multitarget="multi-collapse">
        <bs-button primary>Toggle both elements</bs-button>
        </bs-collapse-multi-toggle>
        </p>

        <bs-row>
        <bs-column xs>
        <bs-collapsable expanded id="multiCollapseExample1" class="multi-collapse">
        <bs-card>
        <bs-card-body>
        <profile-component name="Profile"></profile-component>
        </bs-card-body>
        </bs-card>
        </bs-collapsable>
        </bs-column>
        <bs-column xs>
        <bs-collapsable expanded id="multiCollapseExample2" class="multi-collapse">
        <bs-card>
        <bs-card-body>
        <friends-component name="Friends"></friends-component>
        </bs-card-body>
        </bs-card>
        </bs-collapsable>
        </bs-column>
        <bs-column xs>
        <bs-collapsable expanded id="multiCollapseExample3" class="multi-collapse">
        <bs-card>
        <bs-card-body>
        <storage-component name="Storage"></storage-component>
        </bs-card-body>
        </bs-card>
        </bs-collapsable>
        </bs-column>
        </bs-row>
        -->




        <bs-accordion>
        <bs-card>
        <bs-card-header slot="card-header">
        <bs-collapse-toggle target="collapseOne">
        <h5 class="mb-0">
        <bs-button link>Profile</bs-button>
        </h5>
        </bs-collapse-toggle>
        </bs-card-header>
        <bs-collapsable collapsed id="collapseOne">
        <bs-card-body>
        <profile-component name="Profile"></profile-component>
        </bs-card-body>
        </bs-collapsable>
        </bs-card>
        <bs-card>
        <bs-card-header slot="card-header">
        <bs-collapse-toggle target="collapseTwo">
        <h5 class="mb-0">
        <bs-button link>Friends</bs-button>
        </h5>
        </bs-collapse-toggle>
        </bs-card-header>
        <bs-collapsable collapsed id="collapseTwo">
        <bs-card-body>
        <friends-component name="Friends"></friends-component>
        </bs-card-body>
        </bs-collapsable>
        </bs-card>
        <bs-card>
        <bs-card-header slot="card-header">
        <bs-collapse-toggle target="collapseThree">
        <h5 class="mb-0">
        <bs-button link>Storage</bs-button>
        </h5>
        </bs-collapse-toggle>
        </bs-card-header>
        <bs-collapsable collapsed id="collapseThree">
        <bs-card-body>
        <storage-component name="Storage"></storage-component>
        </bs-card-body>
        </bs-collapsable>
        </bs-card>
        </bs-accordion>


        <!--
        <bs-link-button disabled primary>Hide Profile Friends & Storage</bs-link-button>-->
        <!--
        <br>
        <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>-->
        `
        :html `
        ${i18next.t('info_app2')}
        ${i18next.t('info_app3')}
        <a href="./assets/images/auth.png" target="_blank">
        ${i18next.t('screenshot')}
        </a>.
        `

      }</p>
      <!--  <bs-link-button primary>Learn more</bs-link-button>-->

      <login-component name="Login2"></login-component>
      </bs-jumbotron>


      </bs-container>





      <bs-container >




      <bs-row>
      <bs-column sm demo>
      <agora-picpost-component id="agorapicpost" name="AgoraPicpost"></agora-picpost-component>
      </bs-column>
      <bs-column sm demo>
      <picpost-component id="picpost" name="Picpost"></picpost-component>
      </bs-column>
      <bs-column sm demo>
      <agora-notes-component id="agoranotes" name="AgoraNotes"></agora-notes-component>
      </bs-column>
      <bs-column sm demo>
      <notepod-component id="notepod" name="Notepod"></notepod-component>
      </bs-column>
      </bs-row>
      <bs-row>
      <bs-column sm demo>
      <annonce-component name="Annonce"></annonce-component>
      </bs-column>
      <bs-column sm demo>
      <agora-annonce-component name="AgoraAnnonce"></agora-annonce-component>
      </bs-column>
      <!--  <bs-column sm demo>sm</bs-column>-->
      </bs-row>
      </bs-container>
      <bs-container>
            <bs-row>
            <shexy-component name="Shexy"></shexy-component>
            </bs-row>
      </bs-container>

      <bs-container mt-4 class="footer">
      <bs-row>
      <bs-col>
      <p class="text-center">Design by <a href="https://github.com/scenaristeur/compagent/blob/master/README.md">Smag0 Labs</a></p>
      </bs-col>
      </bs-row>
      </bs-container>


      <messages-component name="Messages"></messages-component>


      <div>

      </div>




      `;
    }

  }

  // Register the new element with the browser.
  customElements.define('app-component', AppComponent);
