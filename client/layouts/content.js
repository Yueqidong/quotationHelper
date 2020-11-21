import './content.html';
import {clients} from '../../lib/collections.js';
import moment from 'moment';

Template.client.helpers({
  client: function() {
    var doc = Meteor.users.find().fetch();

    var num = Meteor.users.find().count();

    var userArray = [];

    for(let i = 0; i<num; i++){
      userArray.push(doc[i].profile.email);
    }

    return clients.find({email:{$nin:userArray}});
  },
  date:function(){
    return moment(this.createdAt).format('MMMM D YYYY');
  }
});

Template.registerDate.helpers({
  newClients:function(){
    return clients.find();
  },
  day:function(){
    var currentDate = moment();
    var doc = clients.find().fetch();
    var num = clients.find().count();
    var daily = 0;
    var weekly = 0;
    var monthly = 0;
    var yearly = 0;
    var dayArray = [];
    for(let i = 0; i<num; i++){
      var aDate = doc[i].createdAt;
      var result = currentDate.diff(aDate,'hours');
      if (result <= 24){
        var daily = daily+1;
      }else if(result <= 24*7 && result>24){
        var weekly = weekly+1;
      }else if(result <=24*30 && result>24*7){
        var monthly = monthly+1;
      }else if (result>24*30){
        var yearly=yearly+1;
      }
      console.log(result)
    }
    dayArray.push(daily,weekly,monthly,yearly);
    console.log(daily);
    console.log(dayArray);
    return dayArray;
  }
});

Template.content.events({
  'click .approve':function(e,inst){
    e.preventDefault();
    var client = this;
    var email = client.email;
    var password = client.password;
    var from = "attendancenoreply@gmail.com";
    var subject = "Your registeration has been approved";
    var text = "Welcome to Quotation Helper, Please use your email "+email+" and password "+password+" to log into the system.";
    Meteor.call('approveClients',email,password,from,subject,text,(error,response)=>{
      if ( error ) {
        console.log( error.reason );
      } else {
        swal("Good job!", "This client has been approved", "success");
          }
    })
  }
});

Template.content.onRendered(function(){
      Meteor.call('generate_pdf', function(err, res) {
        if (err) {
             console.error(err);
        } else if (res) {
             window.open("data:application/pdf;base64, " + res);
        }
      });
});
