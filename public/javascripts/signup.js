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
        remote: "/email-validate"
      },
      gender: {
        required: true,
      },

      password: {
        required: true,
        equalTo: "#pwcheck"
      },
      confirmPassword: {
        required: true,
        equalTo: "#pwcheck"

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
        remote: "Email already taken"
      },

      gender: {
        required: "Select Gender",
      },
      Password: { required: "Enter your Password" },
      confirmPassword: { required: "confirm password" },
    },

    submitHandler: function () {
      // console.log("+++++++++++++++");
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
