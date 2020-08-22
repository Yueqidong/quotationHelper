import './addUser.html';
import { clients } from '../../lib/collections.js';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import swal from 'sweetalert';

Template.addUser.events({
  'submit form':function(e){
    e.preventDefault();
    //get values from the form and store them in an array
    var newUser= {
      userTitle: $(e.target).find('#title').val(),
      name: $(e.target).find('[name=name]').val(),
      companyName: $(e.target).find('[name=companyName]').val(),
      companyAddress: $(e.target).find('[name=companyAddress]').val(),
      BusinessRegistrationNo: $(e.target).find('[name=BRN]').val(),
      email: $(e.target).find('[name=email]').val(),
      contact: $(e.target).find('[name=contact]').val()
    };
    console.log(newUser);
    var name = $(e.target).find('[name=name]').val();
    var company = $(e.target).find('[name=companyName]').val();
    var email = $(e.target).find('[name=email]').val();
    var from = "attendancenoreply@gmail.com";
    var subject = "A new client registered";
    var text = "Please notice that a new client "+name+ " from "+company+" just registered in the system."
    //use a for loop to check if the inserted object exists in the database
    for( let x=0; x<=clients.find().count(); x++){
      exists = clients.findOne({email: newUser.email});
    }
    if(!exists){
      newUser._id = clients.insert(newUser);
      Meteor.call('notifyEmail',email,from,subject,text);
      swal("Good job!", "Client profile has been created", "success");
      //redirect to the home pages
      FlowRouter.go("/");
    }else{
      //a popup window to indicate the Duplicated entry
        swal("Oops!", "Duplicated entry", "error");
      FlowRouter.go("/");
    }
  }
});
