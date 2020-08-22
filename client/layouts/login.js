import './login.html';

Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        var loggedInUser = Meteor.userId();
        Meteor.loginWithPassword(emailVar, passwordVar,function(err){
          if(err){
            swal("Oops!", "Login failed", "error");
          }else{
            FlowRouter.go('/content');
          }
        });

    }
});
