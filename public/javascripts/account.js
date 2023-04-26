$(document).ready(function () {
  $("#usereditForm").validate({
    rules: {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      email: {
        required: true,
      },
    },
    messages: {
      firstName: {
        required: "First Name cannot be blank",
      },

      lastName: {
        required: "Last Name cannot be blank",
      },

      email: {
        required: "Enter your Email",
      },
    },

    submitHandler: function (form) {
      form = document.getElementById("usereditForm");
      const formData = new FormData($(form)[0]);
      console.log(formData);
      console.log("clicked===========");
      $.ajax({
        url: "users/edit",
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        enctype: "multipart/form-data",
        success: function (res) {
          location.href = "/timeline";
        },
        error: function (error) {
          console.log(error);
        },
      });
    },
  });
});
