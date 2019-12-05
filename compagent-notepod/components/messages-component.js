import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class MessagesComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      messages: {type: Array}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.messages =  []
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      console.log(message)
      app.messages.reverse()
      app.messages = [... app.messages, {message: JSON.stringify(message), from: from}]
      app.messages.reverse()
      if (message.hasOwnProperty("action")){
        switch(message.action) {
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
  }

  render() {
    return html`
    <style>
    .pre-scrollable {
      max-height: 340px;
      overflow-y: scroll;
    }
    </style>
    <h1>${this.name}</h1>

    <pre class="pre-scrollable">
    <ul id="messageslist">
    ${this.messages.map((m) => html`<li><b>Agent ${m.from}</b> says "${m.message}"</li>`)}
    </ul>
    </pre>
    `;
  }

}

// Register the new element with the browser.
customElements.define('messages-component', MessagesComponent);
