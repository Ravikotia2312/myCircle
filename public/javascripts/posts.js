$(document).ready(function () { //creating posts
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
      console.log("aaaaa");
      if(!$(form).valid()){
        return null;
      }
    console.log("reached");
    const formData = new FormData($(form)[0]);
      $.ajax({
        url: "posts/create",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
          console.log(res);
          flashMe(res)
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

