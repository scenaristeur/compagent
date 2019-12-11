import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import './i18n-component.js'

import  '../vendor/@lit-element-bootstrap/bs-list-group.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';

import {vcard, foaf, solid, schema, space, rdf, rdfs} from '../vendor/rdf-namespaces/rdf-namespaces.min.js';
// Extend the LitElement base class
class AgoraPicpostComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      agoraPicsListUrl: {type: String},
      pics: {type: Array},
      lang: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.pics = []
    this.lang=navigator.language
    this.agoraPicsListUrl = "https://agora.solid.community/public/Picpost/pics.ttl"
    /*    this.VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    this.FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
    this.SOLID = new $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
    this.SCHEMA = new $rdf.Namespace('http://schema.org/');
    this.SPACE = new $rdf.Namespace('http://www.w3.org/ns/pim/space#');
    this.RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    this.RDFS = new $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')*/
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "langChanged":
          app.lang = message.lang;
          app.requestUpdate();
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
    this.getAgoraData()
  }

  render() {

    const picList = (pics) => html`
    <h3>    pics on Agora (${pics.length})</h3>


    <bs-link-button primary small
    href="${this.agoraPicsListUrl}"
    target="_blank">
    ${this.agoraPicsListUrl}
    </bs-link-button>

    <bs-list-group-action>
    ${pics.map((n) => html`
      <bs-list-group-item-action-link class="flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between">
      <!--              <h5 class="mb-1">${n.title}</h5>-->

      </div>
      <p class="mb-1">
      <div style="white-space: pre-wrap">${n.text}</div>
      </p>
      <!--<small>Donec id elit non mi porta.</small>-->
      <small>${n.date.toLocaleString(this.lang, { timeZone: 'UTC' })}</small>
      <bs-link-button primary small
      href="${n.creator}"
      ?hidden=${n.creator == null}
      target="_blank"
      title="${n.creator}">
      Creator
      </bs-link-button>

      <bs-link-button primary small
      href="${n.also}"
      ?hidden=${n.also == null}
      title="${n.also}"
      target="_blank">
      See Also
      </bs-link-button>
      </bs-list-group-item-action-link>
      `)}
      </bs-list-group-action>
      `;

      return html`


      ${picList(this.pics)}
      `;
    }


    getAgoraData(){
      var app = this
      Tripledoc.fetchDocument(app.agoraPicsListUrl).then(
        picsList => {
          app.picsList = picsList;

          console.log("app.picsList",app.picsList)




          app.picsUri = picsList.findSubjects(rdf.type, schema.MediaObject)
          //  console.log("picsUri",app.picsUri)
          app.pics = []
          app.picsUri.forEach(function (nuri){
            //var subj = nuri.getLocalSubject()
            //  console.log("nuri",nuri)
            //  console.log("doc",nuri.getDocument())
            var text = nuri.getString(schema.text)
            var date = nuri.getDateTime(schema.dateCreated)
            var creator = nuri.getRef(schema.creator)
            var also = nuri.getRef(rdfs.seeAlso)
            //  console.log(text, date)
            var pic = {}
            pic.text = text;
            pic.date = date;
            pic.creator = creator;
            pic.also = also;
            //text = nuri.getAllStrings()*/
            app.pics = [... app.pics, pic]
          })

          app.pics.reverse()
          console.log(app.pics)


          if (app.socket == undefined){
            app.subscribe()
          }else{
            console.log("socket exist deja")
          }

        })
      }

      subscribe(){
        var app = this
        //https://github.com/scenaristeur/spoggy-chat-solid/blob/master/index.html
        var websocket = this.picsList.getWebSocketRef();
        console.log("WEBSOCK",websocket)
        app.socket = new WebSocket(websocket);
        console.log ("socket",app.socket)
        app.socket.onopen = function() {
          const d = new Date();
          var now = d.toLocaleTimeString(app.lang) + `.${d.getMilliseconds()}`
          this.send('sub '+app.agoraPicsListUrl);
          app.agent.send('Messages', now+"[souscription] "+app.agoraPicsListUrl)
          //  this.send('sub https://spoggy.solid.community/public/test/fichier2.ttl');
          /*  this.send('sub https://spoggy.solid.community/public/test');
          this.send('sub https://spoggy.solid.community/public/test/index.ttl');*/
          //  document.getElementById("notification").value = now+"[souscription] "+whiteboardUrl+"\n"+document.getElementById("notification").value;
          //  document.getElementById("notification").value = now+"[souscription] fichier2.ttl\n"+document.getElementById("notification").value;
          console.log("OPENED SOCKET",app.socket)
        };
        app.socket.onmessage = function(msg) {
          if (msg.data && msg.data.slice(0, 3) === 'pub') {
            // resource updated, refetch resource
            const d = new Date();
            var now = d.toLocaleTimeString(app.lang) + `.${d.getMilliseconds()}`
            console.log("msg",msg);
            console.log("data",msg.data)
            //  document.getElementById("notification").value = now+"[notification] "+msg.data+"\n"+document.getElementById("notification").value;
            app.getAgoraData()

          }
          else{console.log("message inconnu",msg)}
        };
      }




    }

    // Register the new element with the browser.
    customElements.define('agora-picpost-component', AgoraPicpostComponent);
