import './manage.html';
import { clients } from '../../lib/collections.js';
import { Session } from 'meteor/session';


Template.usersList.helpers({
  users:function(){
    var doc = clients.find().fetch();
    var num = clients.find().count();
    var userArray = [];
    var currentDate = moment();
    for(let i = 0; i<num; i++){
      userArray.push(doc[i].email);
    }
    //console.log(userArray);
    var result = Meteor.users.find({"profile.email":{$in:userArray}}).fetch();
    //console.log(result);
    var selectedValue = Session.get('selectedOption');
    if(selectedValue == '0'){
      return result;
    }else if (selectedValue =='1'){
      var nonactive =[];
      for(let i = 0; i<result.length; i++){
        var lastLogin=result[i].status.lastLogin.date;
        var days = currentDate.diff(lastLogin,'hours');
        if(days >=24*180){
          nonactive.push(result[i]);
        }
      }
      return nonactive;
    }else if (selectedValue =='2'){
      var monthlyactive = []
      for(let i = 0; i<result.length; i++){
        var lastLogin=result[i].status.lastLogin.date;
        var days = currentDate.diff(lastLogin,'days');
        if(days <=30*24){
          monthlyactive.push(result[i]);
        }
      }
      return monthlyactive;
    }else{
      var yearlyactive = [];
      for(let i = 0; i<result.length; i++){
        var lastLogin=result[i].status.lastLogin.date;
        var days = currentDate.diff(lastLogin,'days');
        if(days <=365*24){
          yearlyactive.push(result[i]);
        }
      }
      return yearlyactive;
    }

  },
  date:function(){
    return moment(this.status.lastLogin.date).format('MMMM D YYYY');
  },
  companyName:function(){
    var email = this.profile.email;
    var doc = clients.find({email:email}).fetch();
    var companyName = [];
    for(let i = 0; i<doc.length; i++){
      companyName.push(doc[i].companyName);
    }
    return companyName;
  },
  companyAddress:function(){
    var email = this.profile.email;
    var doc = clients.find({email:email}).fetch();
    var companyAddress = [];
    for(let i = 0; i<doc.length; i++){
      companyAddress.push(doc[i].companyAddress);
    }
    return companyAddress;
  },
  companyContact:function(){
    var email = this.profile.email;
    var doc = clients.find({email:email}).fetch();
    var companyContact = [];
    for(let i = 0; i<doc.length; i++){
      companyContact.push(doc[i].contact);
    }
    return companyContact;
  }
});

Template.usersList.events({
  'change #choice':function(event,template){
    var selectedValue = $(event.target).val();
    //console.log(selectedValue);
    Session.set('selectedOption',selectedValue);
  },
  'click .save':function(e,inst){

    var companyName = inst.$('[name=companyName]' + '[data-id="' + this._id + '"]').val();
    var companyAddress = inst.$('[name=companyAddress]' + '[data-id="' + this._id + '"]').val();
    var companyContact = inst.$('[name=companyContact]' + '[data-id="' + this._id + '"]').val();
    var companyEmail = this.profile.email;
    console.log(companyName);
    //console.log(userID);
    console.log(companyAddress);
    console.log(companyContact);
    Meteor.call('updateClient',companyName,companyAddress,companyEmail,companyContact,(error,response)=>{
      if(error){
        console.log(error.reason);
      }else{
        swal("Good job!", "The changes has been saved", "success");
        FlowRouter.go("/");
      }
    });
  },
  'click .delete':function(){
    var email = this.profile.email;
    var userID = this._id;
    Meteor.call('deleteUsers',email,userID,(error,response)=>{
      if(error){
        console.log(error.reason);
      }else{
        swal("Good job!", "The user has been deleted", "success");
        FlowRouter.go("/");
      }
    })
  }

});
