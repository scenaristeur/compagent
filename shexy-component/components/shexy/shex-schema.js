import { LitElement, css,  html } from '../../vendor/lit-element/lit-element.min.js';

import { HelloAgent } from '../../agents/HelloAgent.js';

class ShexSchema extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      shapeUrl: { type: String },
      schema: {type: Object }
    };
  }

  constructor() {
    super();
    this.name = 'World';
    this.shapeUrl = '';
    this.schema = {};
    this.shex = ShEx;

  }

  render() {
    return html`

    <p>Hello, ${this.name}!</p>
    <div class="card-panel teal lighten-2">shape forms</div>
    `;
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "shapeUrlChanged":
          app.shapeUrlChanged(message.shapeUrl)
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
/*
  shouldUpdate(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    //  console.log(this.schema)
    });
    if(changedProperties.has('shapeUrl') && this.shapeUrl.length > 0){
      this.loadSchema(this.shapeUrl)
    }
    return changedProperties.has('shapeUrl');
  }*/

  update(schema){

    var shapes = schema.shapes;
    var start = schema.start;
    console.log("start",start)
  }



  shapeUrlChanged(shapeUrl){
    var app = this
    this.shex.Loader.load([shapeUrl], [], [], []).then(loaded => {
      if (loaded.schema){
        console.log("LOADED",loaded.schema)
      //  app.schema = JSON.stringify(loaded.schema);
      /*  let   loadedSchema = new CustomEvent('schema-loaded', {
          detail: {
            schema: loaded.schema
          }
        });
        this.dispatchEvent(loadedSchema);*/
        app.agent.send("shexyForms", {action: "schemaChanged", schema: loaded.schema})
      }
    }, err => {
      //  log(err, "ERROR loadShex")
      console.log("erreur ",err)
      alert(err.message)
    }
  );
}

  /*schema(){
  //log(shapeUrl, "schema loaded")
  //  clearUI();
  //  Schema(loaded.schema)
  //  log("DONE", "schema loaded")
  var schema = loaded.schema;
  var shapes = schema.shapes;
  var start = schema.start;
  for (let [url, constraint] of Object.entries(shapes)) {
  console.log(url)
  Shape(url,constraint)
}
}*/



}

customElements.define('shex-schema', ShexSchema);
