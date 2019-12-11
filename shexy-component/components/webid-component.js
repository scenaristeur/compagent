import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class WebidComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number},
      webId: {type: String},
      username: {type: String},
      friends: {type: Array},
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
    this.username = "unknown"
    this.friends = []
    this.VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    this.FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
    this.SOLID = new $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
    this.SCHEMA = new $rdf.Namespace('http://schema.org/');
    this.SPACE = new $rdf.Namespace('http://www.w3.org/ns/pim/space#');
    this.RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    this.RDFS = new $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')


  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "sessionChanged":
          app.sessionChanged(message.webId)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  sessionChanged(webId){
    this.webId = webId

    if (this.webId != null){
      this.getUserData()
    }else{
      //  this.notes = []
    }
  }

  getUserData(){
    var app = this;
    Tripledoc.fetchDocument(app.webId).then(
      doc => {
        //    console.log("DOC",doc)
        //    console.log(doc.getStatements())
        app.doc = doc;
        app.person = doc.getSubject(app.webId);
        console.log("personne",app.person)
        app.username = app.person.getString(app.FOAF('name'))
        app.friends = app.person.getAllRefs(app.FOAF('knows'))
        console.log("Friends",app.friends)
        const storage = app.person.getRef(app.SPACE('storage'))
        console.log("storage",storage)
        app.person.webId = app.webId
        app.agent.send('Profile',{action: "usernameChanged", username: app.username})
        app.agent.send('Profile',{action: "sessionChanged", webId: app.webId})
        app.agent.send('Friends',{action: "friendsChanged", friends: app.friends})
        //  var person = {}
        //  person.webId = app.webId
        //person.username = app.username
        //person.friends = app.friends
        //  person.storage = app.storage

        app.agent.send('Storage',{action: "storageChanged", storage: storage})
        app.agent.send('Storage',{action: "sessionStorageChanged", storage: storage})
        app.agent.send('Notepod',{action: "personChanged", person: app.person})
        app.agent.send('Annonce',{action: "personChanged", person: app.person})
        app.agent.send('Picpost',{action: "personChanged", person: app.person})


        //  app.initNotePod()

      },
      err => {
        console.log(err)
      }
    );
  }

  render() {
    return html``;
  }
}

// Register the new element with the browser.
customElements.define('webid-component', WebidComponent);
