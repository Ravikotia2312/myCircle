$(document).ready(function () { //creating posts
  toastr.options = {
    'closeButton': true,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'showDuration': '1000',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut',
  }
console.log($("form#createPosts").length);
  $("form#createPosts").validate({
    rules: {
      name: {
        required: true,
        maxlength:30
      },
      image: {
        required: true,
      },
      description: {
        required: true,
        maxlength:300
      } 
    },
    messages: {
      name: {
        required: "A post Must Have name",
        maxlength: 'AAAA'
      },

      image: {
        required: "select an image to upload",
      },

      description: {
        required: "a post must have it's description",
        maxlength: 'AAAA'
      },
    },
    submitHandler: function (form) {
      if(!$(form).valid()){
        return null;
      }
    const formData = new FormData($(form)[0]);
      $.ajax({
        url: "posts/create",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
          console.log(res);
          toastr.success('post successfully created');
          $("#create-post-modal").modal('toggle');
        },
        error: function (error) {
          console.log(error);
        },
      });
      return false;
    },
  });
});

