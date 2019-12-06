import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import './messages-component.js'
import './login-component.js'
import './notepod-component.js'
import './i18n-component.js'

import  '../vendor/@lit-element-bootstrap/bs-navbar.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-nav.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-dropdown.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-form.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-jumbotron.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-layout.bundle.js';



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


  render() {
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


    <bs-container fluid>

    <bs-navbar navbar-light expand-lg class="bg-light">
    <bs-navbar-brand-link>Navbar</bs-navbar-brand-link>
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
    <bs-nav-item><bs-nav-link>Link</bs-nav-link></bs-nav-item>
    <bs-nav-item>
    <bs-dropdown>
    <bs-link-button dropdown-nav-link dropdown-toggle>Dropdown</bs-link-button>
    <bs-dropdown-menu down x-placement="bottom-start">
    <bs-dropdown-item-link title="Action" index="0"></bs-dropdown-item-link>
    <bs-dropdown-item-link title="Another action" index="1"></bs-dropdown-item-link>
    <bs-dropdown-divider></bs-dropdown-divider>
    <bs-dropdown-item-link title="Something else here" index="2"></bs-dropdown-item-link>
    </bs-dropdown-menu>
    </bs-dropdown>
    </bs-nav-item>
    -->
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
    <i18n-component name="I18n"></i18n-component>
    </bs-nav-item>
    </bs-navbar-collapse>

    </bs-navbar>
    </bs-container>

    <bs-container fluid>


    <bs-jumbotron fluid>
    <h1 class="display-4">${i18next.t('hello_world')}</h1>

    <p class="lead">${i18next.t('info_app1')}</p>
    <hr class="my-4">
    <p>  ${this.webId != null ?
      html `
      <p> ${this.webId}</p>
      <br>
      <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>

      `
      :html `${i18next.t('info_app2')}
      ${i18next.t('info_app3')}

      <a href="./assets/images/auth.png" target="_blank">${i18next.t('screenshot')}</a>.

      `

    }</p>
    <!--  <bs-link-button primary>Learn more</bs-link-button>-->

    <login-component name="Login2"></login-component>
    </bs-jumbotron>


    </bs-container>





    <bs-container fluid>
    <bs-row>
    <bs-column sm-8 demo>
    <notepod-component name="Notepod"></notepod-component>
    </bs-column>
    <bs-column sm demo>sm-4</bs-column>
    </bs-row>
    <bs-row>
    <bs-column sm demo>sm</bs-column>
    <bs-column sm demo>sm</bs-column>
    <bs-column sm demo>sm</bs-column>
    <bs-column sm demo>sm</bs-column>
    <bs-column sm demo>sm</bs-column>
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
