import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
import { RdfAgent } from '../agents/RdfAgent.js';
import { FileAgent } from '../agents/FileAgent.js';

//new
import { Spoggy } from "../helpers/spoggy.js";
import { statements2vis } from "../helpers/import-export.js"

// Extend the LitElement base class
class SpoggyComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.spoggy = new Spoggy();
    this.browser= new Spoggy();
    console.log("SP",this.spoggy)
    this.spoggy.parle();

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.rdfAgent = new RdfAgent('rdfAgent');
    this.fileAgent = new FileAgent('fileAgent');

    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      switch(message.action) {
        case "editNode":
        // code block
        app.editNode(message.params.data,message.params.cancelAction,message.params.callback)
        break;
        case "editEdgeWithoutDrag":
        // code block
        app.editEdgeWithoutDrag(message.params)
        break;
        case "updateGraph":
        // code block
        app.spoggy.updateGraph(message.params)
        break;
        case "updateFromFolder":
        app.updateFromFolder(message.folder)
        break;
        case "updateFromFile":
        app.updateFromFile(message.file)
        break;
        case "updateEditorFromNetwork":
        app.updateEditorFromNetwork(message.data)
        break;
        default:
        // code block
        console.log("action inconnue",message)
      }
    };
    this.init();
  }




  render() {
    return html`

    <link href="./vendor/visjs/dist/vis-network.css" rel="stylesheet" type="text/css">
    <link href="./vendor/fontawesome/css/all.css" rel="stylesheet">
    <link href="./vendor/bootstrap-4/css/bootstrap.min.css" rel="stylesheet">

    <style type="text/css">
    /* network */
    .network {
      /*  width: 100%;*/
      height: 400px;
      /*  width: 100%;
      height: 800px;*/
      border: 1px solid lightgray;
    }
    #operation {
      font-size:28px;
    }
    #nodePopUp {
      display:none;
      position: absolute;

      z-index:299;
      width:300px;
      height:200px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    #edge-popUp {
      display:none;
      position: absolute;
      z-index:299;
      width:300px;
      height:120px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    /*  Toggle Slider */
    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }


    /*custum menu */
    .custom-menu {
      display: none;
      z-index: 1000;
      position: absolute;
      overflow: hidden;
      border: 1px solid #CCC;
      white-space: nowrap;
      font-family: sans-serif;
      background: #FFF;
      color: #333;
      border-radius: 5px;
      padding: 0;
    }

    /* Each of the items in the list */
    .custom-menu li {
      padding: 8px 12px;
      cursor: pointer;
      list-style-type: none;
      transition: all .3s ease;
      user-select: none;
    }

    .custom-menu li:hover {
      background-color: #DEF;
    }

    </style>
    <ul id="custom-menu" class='custom-menu'>
    <li data-action="edit" @click=${this.menuClick}>Edit</li>
    <li data-action="expand" @click=${this.menuClick}>Expand</li>
    <!--<li data-action="focus" @click=${this.menuClick}>Focus</li>-->
    </ul>

    <h3 class="m-0 font-weight-bold text-primary">${this.name}</h3>
    <button pimary
    id="nouveau_graph"
    @click=${this.nouveau}

    >Nouveau</button> /n
    <!--  <button id="importer_btn" onclick="catchCommande({value:'/i'})">Ouvrir</button> /i-->
    <button primary id="save_to_pod" disabled onclick="open_ub()">Universal Browser</button> /a
    <button primary id="capture_graphe"  disabled @click=${this.attrappeCommande}>Capturer jpg</button> /c

    <div class="row">
    <div class="col">
    Data is send to "Editor Module " in :<br>  Json
    <label class="switch">
    <input id="formatSwitch" type="checkbox" @click=${this.updateEditorFromNetwork}>
    <span class="slider round"></span>
    </label>
    Ttl
    </div>
    </div>

    </div>

    <div id="nodePopUp">
    <span id="node-operation">node</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>id</td><td><input id="node-id" value="new value" /></td>
    </tr>
    <tr>
    <td>label</td><td><input id="node-label" value="new value" /></td>
    </tr>
    </table>
    <input type="button" value="save" id="node-saveButton" />
    <input type="button" value="cancel" id="node-cancelButton" />
    </div>

    <div id="edge-popUp">
    <span id="edge-operation">edge</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>label</td><td><input id="edge-label" value="new value" /></td>
    </tr></table>
    <input type="button" value="save" id="edge-saveButton" />
    <input type="button" value="cancel" id="edge-cancelButton" />
    </div>

    <div class="network" id="mynetwork" bgcolor="#E6E6FA">  </div>

    `;
  }

  menuClick(e){
    this.shadowRoot.getElementById("custom-menu").style.display = "none"
    var action = e.target.getAttribute("data-action")
    console.log(action, this.currentNode)
    switch(action) {
      case "edit":
    //  var params = {}
    //  params.data = this.currentNode
      //params.callback = this.spoggy.network.editNode()
      this.editNode(this.currentNode)
      // code block
      break;
      case "expand":
      // code block
      break;
      case "focus":
      // code block
      break;
      default:
      // code block
      console.log("action inconnue",action)

    }
  }

  nouveau(){
    this.spoggy.network.body.data.edges.clear();
    this.spoggy.network.body.data.nodes.clear();
  }

  updateEditorFromNetwork(event, properties, senderId){
    //var event = data.event;
    var app = this

    var data = {
      nodes: app.spoggy.network.body.data.nodes.get({
        filter: function (n) {
          return (n.cid != 1);
        }
      }),
      edges: app.spoggy.network.body.data.edges.get({
        filter: function (e) {
          return (e.cid != 1);
        }
      }) };
      // var text = JSON.stringify(data, null, 2)
      //  this.agent.send('Editor', {action: "setValue", data:data});
      var formatTtl = this.shadowRoot.getElementById("formatSwitch")
      console.log(formatTtl.checked)
      var fakefile = {type: "text", uri:""}
      this.agent.send('Visualization', {action: "fileChanged", file:fakefile});
      if(formatTtl.checked == true){

        var text = this.jsonToTtl(data)

        this.agent.send('Editor', {action: "setValue", text:text});
      }else{
        var text = JSON.stringify(data, null, 2)
        this.agent.send('Editor', {action: "setValue", text:text});
      }

      //  document.getElementById('editeur-popUp').style.display = 'block';
    }



    jsonToTtl(data){
      console.log(data)
      var addPropertyList = false;
      var nodes = data.nodes;
      var edges = data.edges;
      var network = this.spoggy.network;

      var output = "@prefix : <http://smag0.blogspot.fr/spoggy#> . \n";
      output += "@prefix owl: <http://www.w3.org/2002/07/owl#> . \n";
      output += "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . \n";
      output += "@prefix xml: <http://www.w3.org/XML/1998/namespace> . \n";
      output += "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> . \n";
      output += "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . \n";
      output += "@prefix smag: <http://smag0.blogspot.fr/spoggy#> . \n";
      output += "@base <http://smag0.blogspot.fr/spoggy> . \n";
      //output += "<http://smag0.blogspot.fr/spoggy> rdf:type owl:Ontology ;  \n";
      //output += "                    owl:versionIRI <http://smag0.blogspot.fr/spoggy/1.0.0> . \n";
      output += " \n";
      //output += "owl:Class rdfs:subClassOf owl:Thing .  \n";

      var listeInfos = new Array();
      var listeComplementaire = new Array();

      for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];

        var sujet = edge.from;
        var propriete = edge.label.replace(/\s/g, "_");
        var objet = edge.to;


        //string.indexOf(substring) > -1
        //console.log(sujet);
        //console.log(propriete);
        console.log(objet);

        // AJOUTER EVENTUELLEMENT LA RECUPERATION DE SHAPE, COLOR, pour l'export RDF
        var sujetLabel = network.body.data.nodes.get(sujet).label.replace(/\n/g, "");
        try{
          var objetLabel = network.body.data.nodes.get(objet).label.replace(/\n/g, "");
        }catch(error)
        {
          console.error("ERREUR NONTRAITEE")
          console.error(error)

        }

        //console.log("#########################");
        //console.log(sujetLabel);
        //console.log(objetLabel)
        //console.log("#########################");

        var sujetWithPrefix = this.validRdf(network, sujet);
        var proprieteWithPrefix = this.validRdf(network, propriete);
        var objetWithPrefix = this.validRdf(network, objet);

        if (sujetWithPrefix.indexOf(':') == -1) { // ne contient pas de ':'
        sujetWithPrefix = '_:' + sujetWithPrefix; // blanknode
      }

      if (proprieteWithPrefix.indexOf(':') == -1) { // ne contient pas de ':'
      proprieteWithPrefix = ':' + proprieteWithPrefix; // propriete utilisant "@base <http://smag0.blogspot.fr/spoggy>"

    }

    if (objetWithPrefix.indexOf(':') == -1) { // ne contient pas de ':'
    objetWithPrefix = '_:' + objetWithPrefix;  // blanknode
  }


  var typedeProp = ["owl:AnnotationProperty", "owl:ObjectProperty", "owl:DatatypeProperty"];
  var indiceTypeDeProp = 1; // -1 pour ne pas ajouter la prop, sinon par defaut en annotationProperty, 1 pour Object, 2 pour Datatype --> revoir pour les datatypes

  if (
    (proprieteWithPrefix == "type") ||
    (proprieteWithPrefix == ":type") ||
    (proprieteWithPrefix == "rdf:type") ||
    (proprieteWithPrefix == ":a") ||
    (proprieteWithPrefix == ":est_un") ||
    (proprieteWithPrefix == ":est_une") ||
    (proprieteWithPrefix == ":is_a")
  ) {
    proprieteWithPrefix = "rdf:type";
    listeComplementaire.push(objetWithPrefix + " rdf:type owl:Class . \n");
    indiceTypeDeProp = 1;
  } else if ((proprieteWithPrefix == "subClassOf") || (proprieteWithPrefix == ":subClassOf") || (proprieteWithPrefix == "rdfs:subClassOf")) {
    proprieteWithPrefix = "rdfs:subClassOf";
  }
  else if ((proprieteWithPrefix == "sameAs") || (proprieteWithPrefix == ":sameAs")) {
    proprieteWithPrefix = "owl:sameAs";
    indiceTypeDeProp = -1;
  }
  else if (
    (proprieteWithPrefix.toLowerCase() == "ispartof") ||
    (proprieteWithPrefix.toLowerCase() == "partof") ||
    (proprieteWithPrefix.toLowerCase() == ":partof") ||
    (proprieteWithPrefix.toLowerCase() == ":ispartof")) {
      proprieteWithPrefix = "smag:partOf";
      indiceTypeDeProp = 1;
    } else if (
      (proprieteWithPrefix.toLowerCase() == "comment") ||
      (proprieteWithPrefix.toLowerCase() == "commentaire") ||
      (proprieteWithPrefix.toLowerCase() == "//") ||
      (proprieteWithPrefix.toLowerCase() == "#")
    ) {
      proprieteWithPrefix = "rdfs:comment";
      indiceTypeDeProp = -1;
    }
    if (indiceTypeDeProp >= 0) {
      listeComplementaire.push(proprieteWithPrefix + " rdf:type " + typedeProp[indiceTypeDeProp] + " . \n");
    }
    var data = sujetWithPrefix + " " + proprieteWithPrefix + " " + objetWithPrefix + " . \n";
    data += sujetWithPrefix + " " + "rdfs:label \"" + sujetLabel + "\" . \n";
    data += objetWithPrefix + " " + "rdfs:label \"" + objetLabel + "\" . \n";
    listeInfos[i] = data;
    console.log(data);
    console.log("||||||||||||||||||||||--");
  }
  //console.log(listeInfos);
  //console.log(listeComplementaire);
  //suppression des doublons
  listeInfos = this.uniq_fast(listeInfos.sort());
  listeComplementaire = this.uniq_fast(listeComplementaire.sort());
  // console.log (listeInfos);
  for (var k = 0; k < listeInfos.length; k++) {
    output = output + listeInfos[k];
    //  console.log(output);
  }
  if (addPropertyList == true){
    for (var l = 0; l < listeComplementaire.length; l++) {
      output = output + listeComplementaire[l];
      //  console.log(output);
    }
  }


  //this.$.dialogs.$.inputTextToSave.value = output; //     document.getElementById("inputTextToSave").value =output;
  /*this.$.dialogs.$.popupTtl.fitInto = this.$.dialogs.$.menu;*/
  //this.$.dialogs.$.popupTtl.toggle();
  //console.log(output)

  //this.agentGraph.send('agentDialogs', {type:'exportTtl', ttlData : output});

  return output
}



uniq_fast(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
    var item = a[i];
    if(seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}

validRdf(network, string){
  // A REVOIR
  console.log(network.body.data.nodes.get(string));
  console.log("nettoyage "+ string);
  // transformer le noeud en noeud rdf (resource ou literal)
  // ajouter la construction du noeud, son uri, prefix, localname, type...
  var valid = {};
  valid.type = "uri";
  if (string.indexOf(" ") !== -1){
    valid.type = "literal";
  }else{
    /*
    replaceAll(string, " ","_");
    replaceAll(string, "","_");
    replaceAll(string, ",","_");
    replaceAll(string, ";","_");
    replaceAll(string, " ","_");*/
  }

  return string;
}

attrappeCommande(){
  catchCommande({value:'/c'})
  console.log("catc")
}

init(){
  var app =this;
  // create a network
  var container = this.shadowRoot.getElementById('mynetwork');
  //  this.spoggy.agent(this.agent)
  this.spoggy.networkFactory(container)

  //  var browsercontainer = this.shadowRoot.getElementById('browsernetwork');
  //  this.spoggy.agent(this.agent)
  //  this.browser.network(browsercontainer)
  console.log("SPOGGY PEUPLE", this.spoggy)
  // JAVASCRIPT (jQuery)

  // Trigger action when the contexmenu is about to be shown
  //https://stackoverflow.com/questions/4495626/making-custom-right-click-context-menus-for-my-web-app/20471268#20471268
  this.spoggy.network.on("oncontextAVOIR", function (params) {
    console.log(params)
    var event = params.event
    console.log("context",event)
    // Avoid the real one
    event.preventDefault();
    console.log($(".custom-menu"))

    var n = app.spoggy.network.getNodeAt(params.pointer.DOM);
    console.log(n)
    if (n != undefined){
      app.currentNode = app.spoggy.network.body.data.nodes.get(n);
      console.log(app.currentNode);
      var m = app.shadowRoot.getElementById('custom-menu')
      m.style.display = "block";
      m.style.top = params.pointer.DOM.y;
      m.style.left =  params.pointer.DOM.x;
    }
    // Show contextmenu
    /*      $(".custom-menu").finish().toggle(100).

    // In the right position (the mouse)
    css({
    top: event.pageY + "px",
    left: event.pageX + "px"
  });*/
});

var network = app.spoggy.network
network.on("selectNodeERRORCALLBACK", function (params) {
  console.log('selectNode Event:', params);
  //var n = network.getNodeAt(params.pointer.DOM);
  //console.log(n)
  if (params.nodes.length == 1) {
    /*if (network.isCluster(params.nodes[0]) == true) {
    network.openCluster(params.nodes[0]);
  }else{*/
  let id = params.nodes[0];
  var node = network.body.data.nodes.get(id);
  console.log(node);
  app.currentNode = node;

  //  node.label.indexOf(' ') >= 0 ? document.getElementById("input").value = '"'+node.label+'" ' : document.getElementById("input").value = node.label+' ';
  //}
}

console.log(app.shadowRoot.getElementById("mynetwork"))
event.preventDefault();
var ord = event.pageY-app.shadowRoot.getElementById("mynetwork").offsetTop
var abs = event.pageX-app.shadowRoot.getElementById("mynetwork").offsetWidth-app.shadowRoot.getElementById("mynetwork").offsetLeft
//console.log("ORD",ord)
// Show contextmenu

var m = app.shadowRoot.getElementById('custom-menu')
m.style.display = "block";
m.style.top = ord + "px"
m.style.left =  abs + "px"


});

network.on("doubleClickATESTER", async function (params) {
  console.log('doubleClick ', params);
  var id = params.nodes[0];
  var existNode;
  try{
    existNode = network.body.data.nodes.get({
      filter: function(node){
        return (node.id == id );
      }
    });
    console.log(existNode);
    if (existNode.length != 0){
      console.log("existe", existNode[0])
      var params = existNode[0];
      params.source = existNode[0].id;
      importer(params,updateGraph)
      fitAndFocus(existNode[0].id)
      if(params.source.endsWith("#me")){
        updateCurrentWebId(params.source)
      }
      //app.nodeChanged(existNode[0]);
      //  app.agentVis.send('agentFileeditor', {type: "nodeChanged", node: existNode[0]});
      //  app.agentVis.send('agentFoldermenu', {type: "nodeChanged", node: existNode[0]});
      //  network.body.data.nodes.add(data);
      //  var thing = this.thing;
    }else{
      console.log("n'existe pas")
      //  delete data.x;
      //  delete data.y
      //  network.body.data.nodes.update(data);
    }
  }
  catch (err){
    console.log(err);
  }
});




// If the document is clicked somewhere
/*
$(document).bind("mousedown", function (e) {

// If the clicked element is not the menu
if (!$(e.target).parents(".custom-menu").length > 0) {

// Hide it
$(".custom-menu").hide(100);
}
});


// If the menu element is clicked
$(".custom-menu li").click(function(){

// This is the triggered action name
switch($(this).attr("data-action")) {

// A case for each action. Your actions here
case "first": alert("first"); break;
case "second": alert("second"); break;
case "third": alert("third"); break;
}

// Hide it AFTER the action was triggered
$(".custom-menu").hide(100);
});
*/

}


updateFromFolder(folder){
  console.log(folder)
  this.folder2vis(folder)
}

updateFromFile(file){
  var app =this;
  this.nouveau()
  console.log(file)
  switch (file.type) {
    case 'application/json':
    var data = JSON.parse(file.content)
    app.spoggy.updateGraph({data:data})

    break;

    case 'text/turtle':
    let doc = $rdf.sym(file.uri);
    let store = $rdf.graph()
    console.log(store)
    try {
      $rdf.parse(file.content, store, doc.uri, 'text/turtle');
    }
    catch(error) {
      alert(error);
    }

    /*  $rdf.parse(result, store,base, mimeType)
    console.log("STORE",store)*/
    var data = statements2vis(store.statements);
    app.spoggy.updateGraph({data:data})
    break;
    default:
    console.log("Ce type de fichier ("+file.type+") n'est pas encore traité")


  }
}



folder2vis(sfolder){
  var app = this;
  //  this.clear()
  console.log('sfolder')
  //  console.log(sfolder)
  var name = sfolder.name;
  var url = sfolder.url;
  var parent = sfolder.parent;
  //  var folders = sfolder.folders||"Folders";
  //  var files = sfolder.files|| "Files";
  var nodes = [];
  var edges = [];
  nodes.push({id: url, label: name, type: "folder", cid:1, shape: "image", image: "./assets/folder.png" });
  //nodes.push({id:'folders', label:"Folder"});
  //edges.push({from:url, to: 'folders', arrows: 'to', label:"type"});
  //console.log("PAREnT", parent)
  if (parent != undefined){
    //  console.log("undef")
    nodes.push({id: parent, label: parent, type: "folder", cid:1, shape: "image", image: "./assets/parentfolder.png" });
    edges.push({from: url, to: parent, cid:1, arrows:'to', label: "parent"});
  }
  //  {id: "urlNode"+url, label: url},
  /*,
  {id: "folderCluster", label: folders},
  {id: "fileCluster", label: files}*/
  // create an array with edges
  //{from: url, to: "urlNode"+url, arrows:'to', label: "url"},
  /*,
  {from: url, to: "folderCluster", arrows:'to', label: "folders"},
  {from: url, to: "fileCluster", arrows:'to', label: "files"},*/
  if (sfolder.folders && sfolder.folders.length >0){
    sfolder.folders.forEach(function(fo){
      if(fo.name != ".."){
        app.folder2vis(fo)
        var node = {id:fo.url, label:fo.name, type: 'folder',cid:1, shape: "image", image: "./assets/folder.png" }
        //  console.log(node)
        nodes.push(node);
        edges.push({from:url, to: fo.url, cid:1, arrows: 'to', label:"folder"});
        edges.push({from:fo.url, to: 'folders', cid:1, arrows: 'to', label:"type"});
      }
    })
  }
  if (sfolder.files && sfolder.files.length > 0){
    //  nodes.push({id:'files', label:"File"});
    sfolder.files.forEach(function(fi){
      //  console.log(fi)
      //  app.file2vis(fi)
      var node = {id:fi.url, label:fi.label, type: 'file' , cid:1, shape: "image", image: "./assets/document.png" };
      //  console.log(node)
      nodes.push(node);
      edges.push({from:url, to: fi.url, cid:1, arrows: 'to', label:"file"});
      //  edges.push({from:fi.url, to: 'files', arrows: 'to', label:"type"});
    })
  }
  var  data = {
    nodes: nodes,
    edges: edges
  };

  //console.log("DATA",data)
  app.browser.updateGraph({data:data})
  //  console.log(data)
  /*this.network.body.data.nodes.clear();
  this.network.body.data.edges.clear();
  this.addSolidToGraph(data);
  this.network.fit();
  this.network.redraw();*/
}










dataToVis(container,data,replace=true){
  var app = this;
  console.log(container);
  console.log(typeof data, data)
  if (typeof data == "string"){
    var params={source : data };
    params.rdfAgent = app.rdfAgent;
    params.fileAgent = app.fileAgent;
    console.log(params)
    importer(params,app.spoggy.updateGraph);
  }


}



getTypeIndex(){

  var app = this;
  app.publicTypeIndexUrl = app.person.getRef(app.SOLID('publicTypeIndex'))
  console.log("publicTypeIndexUrl",app.publicTypeIndexUrl)
}


editNode(data,cancelAction, callback){
  console.log("open",data, cancelAction, callback)
/*  var data = params.data;
  var cancelAction = params.cancelAction ;
  var callback = params.callback ;*/
  this.shadowRoot.getElementById('node-id').value = data.id || "";
  this.shadowRoot.getElementById('node-label').value = data.label;
  //  this.shadowRoot.getElementById('node-shape').value = data.shape || "ellipse";
  this.shadowRoot.getElementById('node-saveButton').onclick = this.saveNodeData.bind(this, data, callback);
  this.shadowRoot.getElementById('node-cancelButton').onclick = this.clearNodePopUp.bind(this, callback);
  //this.cancelAction.bind(this, callback);
  this.shadowRoot.getElementById('nodePopUp').style.display = 'block';
  this.shadowRoot.getElementById('node-label').onkeyup = this.nodeNameChanged.bind(this, data, callback);
}

nodeNameChanged(event,data, callback) {
  if(event.key === 'Enter') {
    event.preventDefault();
    //  document.getElementById("valider").click();
    this.saveNodeData(data, callback)
  }
}

edgeNameChanged(event,data, callback) {
  if(event.key === 'Enter') {
    event.preventDefault();
    //  document.getElementById("valider").click();
    this.saveEdgeData(data, callback)
  }
}
saveNodeData(data, callback) {

  data.label = this.shadowRoot.getElementById('node-label').value;
  /*  console.log(this.shadowRoot.getElementById('node-shape'))
  data.shape = this.shadowRoot.getElementById('node-shape').value;
  console.log(data.shape)
  data.color = {};
  data.color.background = this.shadowRoot.getElementById('colpicbody').value;
  data.color.border =  this.shadowRoot.getElementById('colpicborder').value;
  this.shadowRoot.getElementById('bodycolorpicker').value = this.shadowRoot.getElementById('colpicbody').value;
  this.shadowRoot.getElementById('bordercolorpicker').value = this.shadowRoot.getElementById('colpicborder').value;
  var image_url = this.shadowRoot.getElementById('node-image-url').value || "";
  if (data.shape == "image" || data.shape == "circularImage" && image_url.length > 0){
  data.image = image_url;
}
*/
console.log(data)
//  this.fitAndFocus(data.id)
this.clearNodePopUp();
if (callback != undefined){
  callback(data);
}

}


// Callback passed as parameter is ignored
clearNodePopUp() {
  this.shadowRoot.getElementById('node-saveButton').onclick = null;
  this.shadowRoot.getElementById('node-cancelButton').onclick = null;
  this.shadowRoot.getElementById('nodePopUp').style.display = 'none';
  this.shadowRoot.getElementById('node-label').onkeyup = null;
}

cancelNodeEdit(callback) {
  this.clearNodePopUp();
  callback(null);
}







editEdgeWithoutDrag(params) {
  var data = params.data
  var callback = params.callback
  // filling in the popup DOM elements
  this.shadowRoot.getElementById('edge-label').value = data.label || "";
  this.shadowRoot.getElementById('edge-saveButton').onclick = this.saveEdgeData.bind(this, data, callback);
  this.shadowRoot.getElementById('edge-cancelButton').onclick = this.cancelEdgeEdit.bind(this,callback);
  this.shadowRoot.getElementById('edge-popUp').style.display = 'block';
  this.shadowRoot.getElementById('edge-label').onkeyup = this.edgeNameChanged.bind(this, data, callback);
}

clearEdgePopUp() {
  this.shadowRoot.getElementById('edge-saveButton').onclick = null;
  this.shadowRoot.getElementById('edge-cancelButton').onclick = null;
  this.shadowRoot.getElementById('edge-label').onkeyup = null;
  this.shadowRoot.getElementById('edge-popUp').style.display = 'none';

}

cancelEdgeEdit(callback) {
  this.clearEdgePopUp();
  callback(null);
}

saveEdgeData(data, callback) {
  if (typeof data.to === 'object')
  data.to = data.to.id
  if (typeof data.from === 'object')
  data.from = data.from.id
  data.label = this.shadowRoot.getElementById('edge-label').value;
  data.color = {};
  data.color.inherit='both';
  this.clearEdgePopUp();
  callback(data);
}

clickHandler(event) {
  this.count++
  //console.log(event.target);
  console.log(this.agent)
  this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
}
}

// Register the new element with the browser.
customElements.define('spoggy-component', SpoggyComponent);
