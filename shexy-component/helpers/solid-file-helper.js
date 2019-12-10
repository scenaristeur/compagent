import  '../vendor/solid-file-client/solid-file-client.bundle.js';


export class SolidFileHelper {
  constructor() {
    this.fileClient = SolidFileClient;
    //  console.log(this.fileClient)

  }

  readFolder(uri){
    console.log("readFolder",uri)
    return  this.fileClient.readFolder(uri).then(folder => {
      //   console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
      return folder
    }, err => {
      console.log(err) ;
  //    alert(err)
      return err;
    });
  }

  createFolder(uri){
    console.log("createFolder",uri)
    return  this.fileClient.createFolder(uri).then(folder => {
      //   console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
      console.log(folder)
      return folder
    }, err => {
      console.log(err) ;
      alert(err)
      return err;
    });
  }


  readFile(uri){
    console.log("readFile",uri)
    return  this.fileClient.readFile(uri).then(body => {
      //   console.log(`File content is : ${body}.`);
      return body
    }, err => {
      console.log(err) ;
      alert(err)
      return err;
    });
  }


  fetchAndParse(uri, contentType = 'application/json'){
    console.log("fetch",uri)
    return  this.fileClient.fetchAndParse(uri, contentType).then(graph => {
      console.log("graph",graph)
      //   console.log(`File content is : ${body}.`);
      //  let something = graph.any(someSubject, somePredicate);
      return graph
    }, err => {
      console.log(err) ;
      alert(err)
      return err;
    });
  }



  updateFile(url, newContent, contentType){
    return this.fileClient.updateFile( url, newContent, contentType ).then(
      success => {
        console.log( `Updated ${url}.`)
        return `Updated ${url}.`
      }, err => {
        console.log(err)
        alert(err)
        return err
      });
    }


  }
