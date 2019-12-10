import { LitElement, css,  html } from '../../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../../agents/HelloAgent.js';

class ShapeSelector extends LitElement {
  static get properties() {
    return {
      name: { type: String } ,
      jsonShapeList: { type: String } ,
      liste: { type: Array,
        /*hasChanged(newVal, oldVal) {
        console.log(newVal, oldVal)
      }*/

    }
  };
}

constructor() {
  super();
    this.name = "unknown"
  this.liste = []
}

render() {

  return html`

  <style>
  select {
    display: block; # obligé car materializecss n'arrive pas à initilaiser les selects
  }
  </style>

  <!--  <label>Shape Select</label>-->
  <select class=" flow-text teal lighten-5" @change=${this.selectorChange}>
  <option value="" disabled selected>1 - CHOOSE A GOOD SHEX</option>
  ${this.liste.map(i => html`<option value="${i.value}" title="${i.value}" ?disabled=${this.disabled(i)} >${this.optionName(i)}</option>`)}
  </select>
<!--  <div class="input-field">
  <input disabled ></input><bs-button primary disabled>Use your shex shape</bs-button>
  </div>-->
  <a href="${this.shapeUrl}" target="blank">${this.shapeUrl}</a>


  `;

}

firstUpdated(){
  super.firstUpdated()


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


  this.loadShapeList()
}

doSomething(params){
  console.log(params)
}

loadShapeList(){
  var app = this;
  fetch(this.jsonShapeList)
  .then(function(shapeList) {
    console.log("chargé");
    var sl = shapeList.json().then(function(liste) {
      console.log("parsé");
      console.log(liste)
      app.liste = liste
    }).catch(function(e) {
      console.log("error parsing",e);
      console.log(sl)
    });

  }).catch(function(e) {
    console.log("error fetching",e);
  });
}

shouldUpdate(changedProperties) {
  changedProperties.forEach((oldValue, propName) => {
    console.log(`${propName} changed. oldValue: ${oldValue}`);
  });
  return changedProperties.has('liste') || changedProperties.has('shapeUrl');
}

selectorChange(e) {
  // console.log(e.bubbles);
  let   shapeSelected = new CustomEvent('shape-selected', {
    detail: {
      shapeUrl: e.currentTarget.value
    }
  });
  this.dispatchEvent(shapeSelected);
  this.shapeUrl = e.currentTarget.value
}

optionName(shape){
  return shape.name || shape.value
}

disabled(shape){
  if (shape.name == undefined || shape.name.length < 1){
    return true
  }else{
    return false
  }
}

}

customElements.define('shape-selector', ShapeSelector);
