import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import './shexy/shape-selector.js'
import './shexy/shex-schema.js'
import './shexy/shexy-forms.js'
//import './shexy/shexy-solid.js'
import './shexy/shexy-formatter.js'

import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';

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
    this.name = "unknown"
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
    <link href="./vendor/fontawesome/css/all.css" rel="stylesheet">
      <link href="./vendor/bootstrap-4/css/bootstrap.min.css" rel="stylesheet">

      
    <h1>${this.name}</h1>

    <h5>Select shape to generate Form <a href="${this.jsonList}" title="${this.jsonList}" target="blank"><i class="far fa-eye"></i></a></h5>


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

    `;
  }

}

// Register the new element with the browser.
customElements.define('shexy-component', ShexyComponent);
