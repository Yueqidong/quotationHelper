import './changePwd.html';

Template.changePwd.events({
    'submit form': function(e){
        e.preventDefault();
        var oldPass = $(e.target).find('[name=oldPassword]').val();
        var confirmPass = $(e.target).find('[name=confirmPassword]').val();
        var newPass = $(e.target).find('[name=newPassword]').val();
        console.log(oldPass);
        if(newPass === confirmPass){
          Accounts.changePassword(oldPass, newPass, function(err){
            if(err){
              console.log(err);
           } else {
               swal("Good job!", "Your password has been changed", "success");
               FlowRouter.go('/content');
           }
       });

        }else{
          swal("Oops!", "Your new password does not match", "error");
         }
    },

});
