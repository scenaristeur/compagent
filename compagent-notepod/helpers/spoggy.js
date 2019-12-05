
import { HelloAgent } from '../agents/HelloAgent.js';

export class Spoggy {
  constructor() {
    this.name = "Spoggy Module";
    this.seed = 2;
    var nodes = null;
    var edges = null;
    var network = null;


    this.centralGravityValueDefault = 0.2; //0.0001,
    this.springLengthValueDefault = 200;//170;//200;//127,
    this.springConstantValueDefault = 0.05;//0.04, // 0.05
    this.nodeDistanceValueDefault = 200;//100;//170, //120
    this.dampingValueDefault = 0.09;//0.08 // 0,08;

    this.agent_init()
  }

  agent_init(){

    this.agent = new HelloAgent(this.name);
    console.log("MODULE AGENT",this.agent)
    //this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      console.log(this.id+" RECEIVE IN MODULE "+JSON.stringify(message))
      if (message.hasOwnProperty("webId")){
        this.webId = message.webId

        console.log(this.id+" receive webId "+this.webId)
        if (this.webId != null){
          //  app.getUserData()
          this.logged = true
        }else{
          this.logged = false
          //  app.notes = []
        }
      }
    };
  }

  parle() {
    console.log("Classe Spoggy")
    console.log(`${this.name} aboie.`);
    this.agent.send('Messages', 'Parle depuis module!');
  }
  network(container){
    var module = this;
    // randomly create some nodes and edges
    var nodes = new vis.DataSet([
      {id: "Spoggy", label: 'Spoggy'},
      {id: "Solo", label: 'Solo'},
      {id: "Collaboratif", label: 'Collaboratif'},
      {id: "Explore", label: 'Explore'},
      {id: "Solid", label: 'Solid'},
      {id: "Holacratie", label: 'Holacratie'}
    ]);

    // create an array with edges
    var edges = new vis.DataSet([
      {from: "Spoggy", to: "Solo", arrows:'to', label: "niveau 1"},
      {from: "Spoggy", to: "Collaboratif", arrows:'to', label: "niveau 2"},
      {from: "Spoggy", to: "Explore", arrows:'to', label: "niveau 3"},
      {from: "Spoggy", to: "Solid", arrows:'to', label: "niveau 4"},
      {from: "Spoggy", to: "Holacratie", arrows:'to', label: "niveau 5"},
      {from: "Solo", to: "Collaboratif", arrows:'to', label: "suivant"},
      {from: "Collaboratif", to: "Explore", arrows:'to', label: "suivant"},
      {from: "Explore", to: "Solid", arrows:'to', label: "suivant"},
      {from: "Solid", to: "Holacratie", arrows:'to', label: "suivant"},
    ]);

    // create a network
    //  var container = this.shadowRoot.getElementById('mynetwork');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      layout: {randomSeed:this.seed}, // just to make sure the layout is the same when the locale is changed
      //  locale: val || "en", // document.getElementById('locale').value,
      interaction: {
        navigationButtons: true,
        //  keyboard: true, // incompatible avec le déplacement par flèches dans le champ input
        multiselect: true
      },
      edges:{
        arrows: {
          to:     {enabled: true, scaleFactor:1, type:'arrow'}
        },
        color:{
          inherit:'both',
          highlight: '#000000',
          color: '#2B7CE9'
        }
      },
      nodes:{
        color: {
          highlight: {border: '#000000', background:'#FFFFFF'}
        }
      },
      manipulation: {
        addNode: function (data, callback) {
          // filling in the popup DOM elements
          //  document.getElementById('node-operation').innerHTML = "Ajouter un noeud ";
          module.agent.send('Messages', 'Add node!');
          data.label="";
          module.editNode(data, module.clearNodePopUp, callback);
        },
        editNode: function (data, callback) {
          // filling in the popup DOM elements
          //  module.getElementById('node-operation').innerHTML = "Editer un noeud ";
          module.editNode(data, module.cancelNodeEdit, callback);
        },
        addEdge: function (data, callback) {
          if (data.from == data.to) {
            var r = confirm("Etes-vous certain de vouloir connecter le noeud sur lui-même?");
            if (r != true) {
              callback(null);
              return;
            }
          }
          //  document.getElementById('edge-operation').innerHTML = "Ajouter un lien";
          module.editEdgeWithoutDrag(data, callback);
        },
        editEdge: {
          editWithoutDrag: function(data, callback) {
            //  document.getElementById('edge-operation').innerHTML = "Editer un lien";
            module.editEdgeWithoutDrag(data,callback);
          }
        }
      }
      ,
      physics:{
        enabled: true,
        barnesHut: {
          gravitationalConstant: -1,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 1
        },
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springConstant: 0.08,
          springLength: 100,
          damping: 0.4,
          avoidOverlap: 0
        },
        repulsion: {
          centralGravity: this.centralGravityValueDefault,  //0.001, //0.001 ? A quoi sert cette valeur ?
          springLength: this.springLengthValueDefault,   // 220, //220 (//200 //300)
            springConstant: this.springConstantValueDefault, //0.01, //0.01
            nodeDistance:  this.nodeDistanceValueDefault, //150, //100 //350
            damping: this.dampingValueDefault, ///0.08

          },
          hierarchicalRepulsion: {
            centralGravity: 0.0,
            springLength: 100,
            springConstant: 0.01,
            nodeDistance: 120,
            damping: 0.09
          },
          maxVelocity: 500, //50
          minVelocity: 1, //0.1
          solver: 'repulsion',
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false//,
            //  fit: true
          },
          timestep: 0.5,
          adaptiveTimestep: true
        }
      };
      this.network = new vis.Network(container, data, options);

      // EVENTS on Network

      this.network.body.data.nodes.on("*", function(event, properties, senderId){
        module.updateEditorFromNetwork(event, properties, senderId)
      //  console.log(event)
      }
    );
    this.network.body.data.edges.on("*", function(event, properties, senderId){


      module.updateEditorFromNetwork(event, properties, senderId)
    //  console.log(event)
    }
  );

  this.network.on("click", function (e) {
  //  console.log(e)
    // If the clicked element is not the menu
  /*  if (!$(e.target).parents(".custom-menu").length > 0) {
      var elems = e.nodes.length+e.edges.length;
      console.log(elems)
      if (!elems > 0){
        $(".custom-menu").hide(100);
        console.log(" NON noeud ou edge > 0")
      }
      else{
        console.log("noeud ou edge > 0")
      }
      // Hide it

    } */
  });


/*
  // If the menu element is clicked
  $(".custom-menu li").click(function(){

    // This is the triggered action name
    switch($(this).attr("data-action")) {

      // A case for each action. Your actions here
      case "edit":
      //  var n = network.getNodeAt(params.pointer.DOM);
      //  console.log(n)
      console.log("edit :",network.current);
      network.editNode(network.current);
      break;
      case "expand":
      console.log("expand");
      var params = {}
      params.source = network.current.id;
      importer(params,updateGraph)
      fitAndFocus(network.current.id)
      if(params.source.endsWith("#me")){
        updateCurrentWebId(params.source)
      }
      break;
      case "third":
      alert("third");
      break;
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
  });
  */

  /*
  network.on("oncontext", function (params) {
  console.log(params)
  event.preventDefault();

  // Show contextmenu
  $(".custom-menu").finish().toggle(100).

  // In the right position (the mouse)
  css({
  top: event.pageY + "px",
  left: event.pageX + "px"
});
params.event.preventDefault();
var n = network.getNodeAt(params.pointer.DOM);
console.log(n)
var m = document.getElementById("popup-menu");
m.style.position.top = params.pointer.DOM.y;
m.style.position.left =  params.pointer.DOM.x;
m.style.display = "block";
$(".custom-menu").finish().toggle(100);
$(".custom-menu").css({
top: ,
left:
});
});*/
/*
this.network.on("selectEdge", function (params) {
console.log('selectEdge Event:', params);
if (params.nodes.length == 0){
// sinon on a selectionné un noeud
event.preventDefault();
var networkTopOffset = document.getElementById("mynetwork").offsetTop
var ord = event.pageY-networkTopOffset;
console.log("ORD",ord)
// Show contextmenu
$(".custom-menu").finish().toggle(100).

// In the right position (the mouse)
css({
top: ord + "px",
left: event.pageX + "px"
});
}
});*/


/*
this.network.on("selectNode", function (params) {
console.log('selectNode Event:', params);
//var n = network.getNodeAt(params.pointer.DOM);
//console.log(n)
if (params.nodes.length == 1) {
if (module.network.isCluster(params.nodes[0]) == true) {
module.network.openCluster(params.nodes[0]);
}else{
let id = params.nodes[0];
var node = module.network.body.data.nodes.get(id);
console.log(node);
module.network.current = node;
node.label.indexOf(' ') >= 0 ? document.getElementById("input").value = '"'+node.label+'" ' : document.getElementById("input").value = node.label+' ';
}

}


event.preventDefault();
var networkTopOffset = document.getElementById("mynetwork").offsetTop
var ord = event.pageY-networkTopOffset;
console.log("ORD",ord)
// Show contextmenu
$(".custom-menu").finish().toggle(100).

// In the right position (the mouse)
css({
top: ord + "px",
left: event.pageX + "px"
});


});*/
/*
this.network.on("doubleClick", async function (params) {
console.log('doubleClick ', params);
var id = params.nodes[0];
var existNode;
try{
existNode = module.network.body.data.nodes.get({
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
*/
}

editNode(data, cancelAction, callback) {
  // recup colorpickers
  /*var colpicbody = this.shadowRoot.getElementById('bodycolorpicker').cloneNode(true);
  colpicbody.id="colpicbody";
  var colpicborder = this.shadowRoot.getElementById('bordercolorpicker').cloneNode(true);
  colpicborder.id="colpicborder"
  this.shadowRoot.getElementById('node-operation').appendChild(colpicbody)
  this.shadowRoot.getElementById('node-operation').appendChild(colpicborder)
  data.color && data.color.background? document.getElementById('colpicbody').value = data.color.background : "";
  data.color && data.color.border? document.getElementById('colpicborder').value = data.color.border : "";*/
  var module = this;
  /*  var allAgents = Object.keys(this.agent.connections[0].transport.agents);
  console.log(allAgents)
  allAgents.forEach(function (agent){
  module.agent.send(agent, "BROADCAST OUVRE NODE POPUP");
})*/
this.agent.send("Spoggy", {action: "editNode", params:{data: data, cancelAction: cancelAction, callback: callback} })
/*
$('#node-id').value = data.id || "";
$('#node-label').value = data.label;
$('#node-shape').value = data.shape || "ellipse";
$('#node-saveButton').onclick = this.saveNodeData.bind(this, data, callback);
$('#node-cancelButton').onclick = cancelAction.bind(this, callback);
$('#node-popUp').style.display = 'block';
$('#node-label').onkeyup = this.nodeNameChanged.bind(this, data, callback);*/
}

editEdgeWithoutDrag(data, callback){
  this.agent.send("Spoggy", {action: "editEdgeWithoutDrag", params:{data: data, callback: callback} })
}

updateEditorFromNetwork(event, properties, senderId){
  var data = {event:event, properties: properties, senderId: senderId}

  this.agent.send("Spoggy", {action: "updateEditorFromNetwork", data:data })
}
updateEditorFromNetworkTtl(text){
  //  console.log(event, properties, senderId)
  //var text = JSON.stringify(network.body.data, null, 2)
  editor.session.setValue(text)
  editor.format = "ttl"
  //  document.getElementById('editeur-popUp').style.display = 'block';
}

updateGraph(message){
  console.log("update graph",message);
  var app =this;
  if (message.params!= undefined && message.params.remplaceNetwork){
    this.network.body.data.nodes.clear();
    this.network.body.data.edges.clear();
  }
  //this.network.body.data.nodes.update(message.data.nodes)
  //this.network.body.data.edges.update(message.data.edges)
  console.log("this",app)
  this.addResultsToGraph(this.network, message.data)
  //  this.network.fit();
  //  this.network.redraw();
  //  console.log("add results to graph"/*,this.network*/)
}

addResultsToGraph(network, results){
  var app = this;
  var nodes = results.nodes;
  var edges = results.edges;
  //DESACTIVATION STABIL POUR PLUS DE FLUIDITE
  var options = {
    physics:{
      stabilization: false
    },
    edges: {
      smooth: {
        type: "continuous",
        forceDirection: "none"
      }
    }
  }
  app.network.setOptions(options);

  nodes.forEach(function(n){
    app.addNodeIfNotExist(app.network, n);
  });
  app.network.body.data.edges.update(edges)
  //REACTIVATION STABIL POUR PLUS DE FLUIDITE
  options = {
    physics:{
      stabilization: true
    }
  }
  app.network.setOptions(options);
  //app.network.redraw();
}

addNodeIfNotExist(network, data){
  var existNode = false;
  //console.log(data);
  var nodeId;
  try{
    existNode = network.body.data.nodes.get({
      filter: function(n){
        return (n.id == data.id || (n.label == data.label)); //  || n.title == data.label
      }
    });
    //console.log(existNode);
    if (existNode.length == 0){
      //  console.log("n'existe pas")
      nodeId =   network.body.data.nodes.add(data)[0];
    }else{
      //  console.log("existe")
      delete data.x;
      delete data.y
      nodeId =  network.body.data.nodes.update(data)[0];
    }
  }
  catch (err){
    console.log(err);
  }
}



fitAndFocus(node_id){
  console.log("Fonctionnement erratique de fitAndFocus, suspendu pour l'instant")
  var network = this.network;
  var oneStab = true;
  this.network.on("stabilized", function(params){
    //http://visjs.org/docs/network/index.html?keywords=fit
    console.log(params)
    /*  if (oneStab){
    oneStab = false;
    autofit.checked? network.fit(): "";
    var options = {
    scale: 1,
    offset: {x:1, y:1},
    //  locked: true,
    animation: { // -------------------> can be a boolean too!
    duration: 1000,
    easingFunction: "easeInOutQuad"
  }
};
autofocus.checked? network.focus(node_id, options): "";

}else{
console.log("other stab")
}*/
});
}



}
