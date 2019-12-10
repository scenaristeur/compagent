import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import './shexy/shape-selector.js'
import './shexy/shex-schema.js'
import './shexy/shexy-forms.js'
import './shexy/shexy-solid.js'
import './shexy/shexy-formatter.js'

// Extend the LitElement base class
class ShexyComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number},
      shapeUrl: { type: String },
      schema: {type: String},
      jsonList: {type: String},
      loading: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
    this.shapeUrl = "";
    this.schema = {};

    this.jsonList = "./data/shapesList.json"
    this.loading = false;

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

  shapeChanged(e){
    this.shapeUrl = e.detail.shapeUrl
    console.log("shapeChanged",this.shapeUrl)
    this.loading = true;
    this.agent.send("shexySchema",{action: "shapeUrlChanged", shapeUrl: this.shapeUrl})
  }
  schemaLoaded(e){
    console.log(e)
    this.schema = JSON.stringify(e.detail.schema)
    this.loading = false;
  }

  render() {
    return html`
    <h1>${this.name}</h1>
    <p>${this.message}</p>
    <p>${this.count}</p>

    <h5>Select shape to generate Form</h5>
    <a href="${this.jsonList}" title="${this.jsonList}" target="blank"><i class="material-icons right">visibility</i></a>

    <shape-selector
    name="ShapeSelector"
    jsonShapeList="${this.jsonList}"
    @shape-selected="${(e) => { this.shapeChanged(e) }}"
    ></shape-selector>

    <shexy-forms
    name="shexyForms"
    schema=${this.schema}
    ></shexy-forms>

    <shex-schema
    name="shexySchema"
    shapeUrl=${this.shapeUrl}
    @schema-loaded="${(e) => { this.schemaLoaded(e) }}"
    ></shex-schema>

    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    `;
  }

}

// Register the new element with the browser.
customElements.define('shexy-component', ShexyComponent);
