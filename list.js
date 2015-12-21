Tasks = new Mongo.Collection("tasks");
Images = new Mongo.Collection("image");

if(Meteor.isServer){
   Meteor.methods({
deleter:function(){
        Images.remove({});
    },
      sendLogMessage: function(){
        Tasks.remove({});
    }
   });
}


if (Meteor.isClient) {


   Meteor.methods({

    deleter:function(){
        Images.remove({});
    },

      sendLogMessage: function(){
        Tasks.remove({});
    }
   });
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      // Show newest tasks at the top
      return Tasks.find({}, {sort: {createdAt: -1}});
    },

    image:function(){
      console.log("asd");
       return Images.find({}, {sort: {createdAt: -1}});
      
    },

    arr:function(){
       var car = [0];
       return car;
    }


  });

  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
        var take = event.target.text.value;
         var text;

      HTTP.call( 'GET',  'http://pokeapi.co/api/v1/pokedex/1/', {}, function( error, response ) {
   
      var hello = response.content;
      var next = JSON.parse(hello);
      for(var i=0;i<next.pokemon.length;i++){
        var product = next.pokemon[i];
        
        for(var key in product){
          if(key=='name'){

            if(next.pokemon[i].name==take){
              var start = next.pokemon[i].resource_uri;
              HTTP.call( 'GET',  "http://pokeapi.co/" + start , {}, function( error, response ) {
                  var first = response.content;
                  var second = JSON.parse(first);
                  var sprite = second.sprites[0].resource_uri;
                  for(var z=0;z<second.abilities.length;z++){
                    var loop = second.abilities[z];
                    for(var key in loop){
                      if(key=='name'){
                        text = second.abilities[z].name;
                        Meteor.call('sendLogMessage');
                        Tasks.insert({
                            text: "ability: " + text,
                            createdAt: new Date() // current time
                        });
                      }
                    }
                  }

                  for(var z=0;z<second.moves.length;z++){
                    var loop = second.moves[z];
                    for(var key in loop){
                      if(key=='name'){
                        text = second.moves[z].name;
                        Tasks.insert({
                            text: "move name: " + text,
                            createdAt: new Date() // current time
                        });
                      }
                    }
                  }

                   HTTP.call( 'GET',  "http://pokeapi.co/" + sprite , {}, function( error, response ) {
                                  var firster = response.content;
                                  var seconder = JSON.parse(firster);
                                   Meteor.call('deleter');
                                  Images.insert({
                                    url:"http://pokeapi.co/" + seconder.image,
                                    createAt: new Date()
                                  });
                  });

                 



              });
          }
        }
       }
     }


 
    
  
    });
     
 
      // Clear form
      event.target.text.value = "";
    },

 "click .remove": function (event) {
     

       console.log("asdf");
        Meteor.call('sendLogMessage');
        Meteor.call('deleter');
    }
});

  

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}
      });
    },
    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });
}
