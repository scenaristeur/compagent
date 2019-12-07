import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import  '../vendor/@lit-element-bootstrap/bs-list-group.bundle.js';

// Extend the LitElement base class
class StorageComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number},
        storage: {type: String},
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
    this.storage = ""

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "storageChanged":
          // code block
          app.storageChanged(message.storage)
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
    <bs-card>
    <bs-card-img position="top" slot="top-image">
    <!--
    <img src="https://forum.solidproject.org/uploads/default/original/2X/1/17fa5b5c2a39024abe5a4daba5c4beae7ff9f01d.png" width="180px" height="180px" >
    -->
         <svg class="bd-placeholder-img"
    width="180" height="180"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    focusable="false" role="img"
    aria-label="Placeholder: Image cap"><title>Placeholder</title>
    <rect width="100%" height="100%" fill="#868e96">
    </rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>
    </svg>

    </bs-card-img>
    <h1>${this.name}</h1>
    <bs-card-body>
    <bs-card-title slot="card-title">
    <h5>browser :</h5>
    ${this.storage}
    </bs-card-title>
    <bs-card-text slot="card-text">

    <bs-row>
    <bs-col>
    <h5>folders :</h5>
    <bs-list-group>
        <bs-list-group-item active>Cras justo odio</bs-list-group-item>
        <bs-list-group-item>Dapibus ac facilisis in</bs-list-group-item>
        <bs-list-group-item>Morbi leo risus</bs-list-group-item>
        <bs-list-group-item>Porta ac consectetur ac</bs-list-group-item>
        <bs-list-group-item>Vestibulum at eros</bs-list-group-item>
    </bs-list-group>
    </bs-col>
    <bs-col>
    <h5>files :</h5>
    <bs-list-group>
        <bs-list-group-item active>Cras justo odio</bs-list-group-item>
        <bs-list-group-item>Dapibus ac facilisis in</bs-list-group-item>
        <bs-list-group-item>Morbi leo risus</bs-list-group-item>
        <bs-list-group-item>Porta ac consectetur ac</bs-list-group-item>
        <bs-list-group-item>Vestibulum at eros</bs-list-group-item>
    </bs-list-group>
    </bs-col>
    </bs-row>



    <!--  <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>-->
    <br>
    </bs-card-text>
    <bs-link-button disabled primary>Explore</bs-link-button>
    </bs-card-body>
    </bs-card>

    <!--  <p>${this.message}</p>
    <p>${this.count}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>-->
    `;
  }

  storageChanged(storage){
    console.log(storage)
    this.storage = storage
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }
}

// Register the new element with the browser.
customElements.define('storage-component', StorageComponent);
