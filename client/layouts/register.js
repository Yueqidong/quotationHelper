import './register.html';

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        Meteor.call('createUsers',emailVar,passwordVar,(error, response)=>{
          if(error){
            console.log(error.reason);
          }else{
            swal("Good job!", "A new user has been created", "success");
            FlowRouter.go("/");
          }
        });

    // Need _id of existing user record so this call must come after `Accounts.createUser`.

    }
});
