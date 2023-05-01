$(document).ready(function () {
  

  $.validator.addMethod("pwcheck", function(value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
        && /[a-z]/.test(value) // has a lowercase letter
        && /\d/.test(value) // has a digit
 });

  $("#form").validate({
    rules: {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      email: {
        required: true,
        remote: "/email-validate",
        email:true,
      },
      gender: {
        required: true,
      },
      password: {
        required: true,
        pwcheck: true,
        minlength: 8
      },
      confirmPassword: {
        required: true,
        equalTo: "#password"  

      },
    },
    messages: {
      firstName: {
        required: "Enter your First Name",
      },

      lastName: {
        required: "Enter your Last Name",
      },

      email: {
        required: "Enter your Email",
        email: "please enter a valid email",
        remote: "Email already taken"
      },

      gender: {
        required: "Select Gender",
        pwcheck: "enter valid password"
      },
      password: { 
      required: "Enter your Password",
      pwcheck:"enter a strong password",
      minlength:"must be atleast 8 characters"
     },
      confirmPassword: {
         required: "confirm password" ,
          equalTo:"enter a valid password"
    },
    },

    submitHandler: function () {
      $.ajax({
        url: "/register-post",
        type: "POST",
        data: {
          firstName: $("#firstName").val(),
          lastName: $("#lastName").val(),
          email: $("#email").val(),
          gender: $("input[name='gender']:checked").val(),
          password: $("#password").val(),
          confirmPassword: $("#confirmPassword").val(),
        },
        success:function (res) {
          if(res.type=="success")
          {
            alert("user registered successfully")
          }
          if(res.type=="error")
          {
            alert("email already registered")
          }
          if(res.type=='unmatchedPasswords')
          {
            alert("password and confirm password must be same")
          }
        }
      });
    },
  });
});
