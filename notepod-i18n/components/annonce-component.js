import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import  '../vendor/@lit-element-bootstrap/bs-form.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';

import './i18n-component.js'

// Extend the LitElement base class
class AnnonceComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      source: {type: String},
      annonces: {type: Array},
      lang: {type: String},
      agoraAnnonceListUrl: {type: String},
      person: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.person = {}
    this.source = "unknown"
    this.agoraAnnonceListUrl = "https://agora.solid.community/public/Annonce/annonces.ttl"
    this.annonces = []
    this.lang=navigator.language
    this.VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    this.FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
    this.SOLID = new $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
    this.SCHEMA = new $rdf.Namespace('http://schema.org/');
    this.SPACE = new $rdf.Namespace('http://www.w3.org/ns/pim/space#');
    this.RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    this.RDFS = new $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')
    this.AGORA = new $rdf.Namespace('https://agora.solid.community/public/')

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
          case "personChanged":
          app.personChanged(message.person)
          break;
          case "langChanged":
          app.lang = message.lang;
          app.requestUpdate();
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  personChanged(person){
    this.person=person;
    this.initAnnoncePod()
  }


  sessionChanged(webId){
    this.webId = webId
    if (this.webId != null){
      this.annonces = []
    }
  }

  /*
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
  app.initNotePod()
  app.agent.send('Profile',{action: "usernameChanged", username: app.username})
  app.agent.send('Profile',{action: "sessionChanged", webId: app.webId})
  app.agent.send('Friends',{action: "friendsChanged", friends: app.friends})
  const storage = app.person.getRef(app.SPACE('storage'))
  console.log("storage",storage)
  app.agent.send('Storage',{action: "storageChanged", storage: storage})
},
err => {
console.log(err)
}
);
}*/

initAnnoncePod(){
  var app = this;
  app.publicTypeIndexUrl = app.person.getRef(app.SOLID('publicTypeIndex'))
  //console.log("publicTypeIndexUrl",app.publicTypeIndexUrl)

  Tripledoc.fetchDocument(app.publicTypeIndexUrl).then(
    publicTypeIndex => {
      app.publicTypeIndex = publicTypeIndex;
      app.annoncesListEntry = app.publicTypeIndex.findSubject(app.SOLID('forClass'), app.AGORA('Annonce'));
       console.log("app.annoncesListEntry",app.annoncesListEntry)
      if (app.annoncesListEntry === null){
        app.annoncesListUrl = app.initialiseAnnoncesList(app.person, app.publicTypeIndex)
      }else{
        app.annoncesListUrl = app.annoncesListEntry.getRef(app.SOLID("instance"))
          console.log("annoncesListUrl",app.annoncesListUrl)

      }
      app.getAnnonces()
    },
    err => {console.log(err)}
  );
}


getAnnonces(){
  var app = this;
    console.log("getAnnonces at ",app.annoncesListUrl)
  Tripledoc.fetchDocument(app.annoncesListUrl).then(
    annoncesList => {
      app.annoncesList = annoncesList;

          console.log("app.annoncesList",app.annoncesList)
      app.annoncesUri = annoncesList.findSubjects(app.RDF('type'),app.AGORA('Annonce'))
        console.log("annoncesUri",app.annoncesUri)
      app.annonces = []
      app.annoncesUri.forEach(function (nuri){
        var subject = nuri.asNodeRef()
        //  console.log("subject",subject)
        //  console.log("doc",nuri.getDocument())
        var text = nuri.getString(app.SCHEMA('text'))
        var date = nuri.getDateTime(app.SCHEMA('dateCreated'))
        //  console.log(text, date)
        var annonce = {}
        annonce.text = text;
        annonce.date = date;
        annonce.subject = subject;
        //text = nuri.getAllStrings()*/
        app.annonces = [... app.annonces, annonce]
      })

      app.annonces.reverse()
    })
  }



  addAnnonce(){
    var app = this

    //  console.log(app.annoncesList)
    if (app.annoncesList == undefined){
      alert(i18next.t('must_log'))
    }else{
      var textarea = this.shadowRoot.getElementById('annoncearea').shadowRoot.querySelector(".form-control")
      var annonce = textarea.value.trim()
      textarea.value = ""
      //  console.log(annonce)
      const newAnnonce = app.annoncesList.addSubject();
      var date = new Date(Date.now())
      // Indicate that the Subject is a schema:TextDigitalDocument:
      newAnnonce.addRef(app.RDF('type'), app.AGORA('Annonce'));
      // Set the Subject's `schema:text` to the actual annonce contents:
      newAnnonce.addLiteral(app.SCHEMA('text'), annonce);
      // Store the date the annonce was created (i.e. now):
      newAnnonce.addLiteral(app.SCHEMA('dateCreated'), date)
 console.log("newAnnonce",newAnnonce)
      app.annoncesList.save([newAnnonce]).then(
        success=>{
          var checkAgora = this.shadowRoot.getElementById('agora_pub').shadowRoot.firstElementChild.checked
          if(checkAgora == true){
            app.updateAgora(annonce, date, newAnnonce.asNodeRef())
          }
          app.initAnnoncePod()
        },
        err=>{
          console.log(err)
          alert(err)
        });

      }




    }

    updateAgora(annonce,date, subject){
      var app = this;
        console.log("app.agoraAnnonceListUrl",app.agoraAnnonceListUrl)
      Tripledoc.fetchDocument(app.agoraAnnonceListUrl).then(
        agoraAnnonceList => {
          app.agoraAnnonceList = agoraAnnonceList;
            console.log("app.agoraAnnonceList",app.agoraAnnonceList)
          const newAnnonce = app.agoraAnnonceList.addSubject();
          // Indicate that the Subject is a schema:TextDigitalDocument:
          newAnnonce.addRef(app.RDF('type'), app.AGORA('Annonce'));
          // Set the Subject's `schema:text` to the actual annonce contents:
          newAnnonce.addLiteral(app.SCHEMA('text'), annonce);
          // Store the date the annonce was created (i.e. now):
          newAnnonce.addLiteral(app.SCHEMA('dateCreated'), date)
          // add ref to user annonce
          newAnnonce.addRef(app.RDFS('seeAlso'), subject);
          newAnnonce.addRef(app.SCHEMA('creator'), app.webId);
console.log("newAnnonce", newAnnonce)
          app.agoraAnnonceList.save([newAnnonce]).then(
            success=>{
              console.log("success agora", success)
              //  app.initNotePod()
            },
            err=>{
              console.log(err)
            });
          });
        }

        initialiseAnnoncesList(profile,typeIndex){
          var app = this;
          console.log("creation a revoir")
          const storage = profile.getRef(app.SPACE('storage'))
          //    console.log("storage",storage)
          app.agent.send('Storage',{action: "storageChanged", storage: storage})

          const annoncesListUrl = storage + 'public/Annonce/annonces.ttl';

          const annoncesList = Tripledoc.createDocument(annoncesListUrl);
          annoncesList.save();

          // Store a reference to that Document in the public Type Index for `schema:TextDigitalDocument`:
          const typeRegistration = typeIndex.addSubject();
          typeRegistration.addRef(app.RDF('type'), app.SOLID('TypeRegistration'))
          typeRegistration.addRef(app.SOLID('instance'), annoncesList.asRef())
          typeRegistration.addRef(app.SOLID('forClass'), app.AGORA('Annonce'))
          typeIndex.save([ typeRegistration ]);

          return annoncesListUrl
          /*// Get the root URL of the user's Pod:
          const storage = profile.getRef(space.storage);

          // Determine at what URL the new Document should be stored:
          const annoncesListUrl = storage + 'public/annonces.ttl';
          // Create the new Document:
          const annoncesList = createDocument(annoncesListUrl);
          await annoncesList.save();

          // Store a reference to that Document in the public Type Index for `schema:TextDigitalDocument`:
          const typeRegistration = typeIndex.addSubject();
          typeRegistration.addRef(rdf.type, solid.TypeRegistration)
          typeRegistration.addRef(solid.instance, document.asRef())
          typeRegistration.addRef(solid.forClass, schema.TextDigitalDocument)
          await typeIndex.save([ typeRegistration ]);

          // Then finally return the new Document:
          return annoncesList;
          */
        }

        render() {
          const annonceList = (annonces) => html`
          Annonce List (${annonces.length})<br>
          <ul>
          ${annonces.map((n) => html`
            <li>
            ${n.text}, <small>${n.date.toLocaleString(this.lang, { timeZone: 'UTC' })}</small>
            <a href="${n.subject}" _target="_blank"><small>Open</small></a>
            </li>
            `)}
            </ul>
            `;

            return html`
            <h3 class="m-0 font-weight-bold text-primary">${this.name}</h3>
            <bs-form-group>
            <!--<bs-form-label slot="label">Example textarea</bs-form-label>-->
            <bs-form-textarea id ="annoncearea" rows="8" slot="control"></bs-form-textarea>
            </bs-form-group>
            <br>
            <bs-button primary @click=${this.addAnnonce}>${i18next.t('add_annonce')}</bs-button>
            <bs-form-check-group>
            <bs-form-checkbox-input id="agora_pub" name="agora_pub" slot="check" checked></bs-form-checkbox-input>
            <bs-form-check-label slot="label">${i18next.t('agora_publish')}</bs-form-check-label>
            </bs-form-check-group>
            <br>
            <p>
            ${annonceList(this.annonces)}
            </p>
            `;
          }
        }

        // Register the new element with the browser.
        customElements.define('annonce-component', AnnonceComponent);
