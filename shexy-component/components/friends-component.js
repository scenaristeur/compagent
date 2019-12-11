import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import  '../vendor/@lit-element-bootstrap/bs-list-group.bundle.js';


// Extend the LitElement base class
class FriendsComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number},
      friends: {type: Array}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.friends = []
    this.count = 0;

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "friendsChanged":
          // code block
          app.friendsChanged(message.friends)
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
    bs-card-img{
      max-width:33%
    }
    </style>

    <bs-card>
  <!--  <bs-card-img position="top" slot="top-image">
         <svg class="bd-placeholder-img"
    width="180" height="180"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    focusable="false" role="img"
    aria-label="Placeholder: Image cap"><title>Placeholder</title>
    <rect width="100%" height="100%" fill="#868e96">
    </rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>
    </svg>
    </bs-card-img>-->
    <h1>${this.name}</h1>
    <bs-card-body>
    <bs-card-title slot="card-title">
    <h5>online:</h5>
    </bs-card-title>
    <bs-card-text slot="card-text">
    <bs-list-group>
    ${this.friends.map((f) => html`
      <bs-list-group-item @click=${this.clickFriend} uri=${f}>${f}</bs-list-group-item>
      `)}
      </bs-list-group>
      <!--  <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>-->
      <br>
      </bs-card-text>
      <bs-link-button disabled primary>See more -> graph Spoggy</bs-link-button>
      </bs-card-body>
      </bs-card>
      `;
    }

    friendsChanged(friends){
      console.log(friends)
      this.friends = friends
    }

    clickFriend(event) {
      var uri = event.target.getAttribute("uri");
      this.agent.send('Storage',{action: "storageChanged", storage: uri})
      //console.log(event.target);
      //  console.log(this.agent)
      //this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
    }
  }

  // Register the new element with the browser.
  customElements.define('friends-component', FriendsComponent);
