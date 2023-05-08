$(document).ready(function () {
  //editing posts
  console.log($("form#editPosts").length);
  $("form#editPosts").validate({
    rules: {
      name: {
        required: true,
        maxlength: 30,
      },
      image: {
        required: true,
      },
      description: {
        required: true,
        maxlength: 300,
      },
    },
    messages: {
      name: {
        required: "A post Must Have name",
        maxlength: "postname should not exceed 30 characters",
      },

      image: {
        required: "select an image to upload",
      },

      description: {
        required: "a post must have it's description",
        maxlength: "description must be of 300 characters",
      },
    },
    submitHandler: function (form) {
      console.log("aaaaa");
      if (!$(form).valid()) {
        return null;
      }
      console.log("reached");
      const formData = new FormData($(form)[0]);

      $.ajax({
        url: "posts/postsedit",
        type: "put",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
          console.log(res);
          // flashMe(res);
          toastr.success("post edited successfully")
          $("#edit-post-modal").modal("hide");
        },
        error: function (error) {
          console.log(error);
        },
      });
      return false;
    },
  });

  $("form#comment-form").validate({
    rules: {
      comment: {
        required: true,
        maxlength:300
      },
    },
    messages: {
      comment: {
        required: "comment field cannot be empty",
        maxlength: 'maxlength 300 allowed'
      },
    },
    submitHandler: function (form) {
      console.log("++++++++++++++++reached++++++++++++++++");
        var $form = $(form)
      // const value = $("#comment-input").val();
      $.ajax({
        url: `posts/${$('#PostId-comment').val()}/create-comment`,
        type: "POST",
        data: $form.serialize(),
      
        success: function (res) {
          console.log(res);
          $("#modal-scrollable-comment").modal('toggle');
          toastr.success("comment successfully added")
        },
        error: function (error) {
          console.log(error);
        },
      });
      return false;
    },
  });
});

//archieving posts
$(document).on("click", "#archievePost", function () {
  console.log("clicked");
  let archieve = $(this);
  $.ajax({
    url: `/posts/${$(this).data("id")}`,
    type: "DELETE",
    success: function (res) {
      archieve.closest(".postBody").remove();
      toastr.error("post Archieved")
    },
    error: function (error) {
      console.log(error);
    },
  });
});

function getUrl() {
  let url = "/filter";
  const sort = $("#sort").val();
  const filter = $("#filter").val();
  const search = $("#search").val();
  if (filter) {
    url += `?filter=${filter}`;
  }
  if (sort) {
    url += `&sort=${sort}`;
  }
  if (search) {
    url += `&search=${search}`;
  }
  return url;
}

// filtering  posts
$(document).on("change", ".common-filter", function () {
  console.log(getUrl());
  console.log($(this).val());

  $.ajax({
    url: getUrl(),
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

// filtering  posts
$(document).on("click", ".common-filter", function () {
  console.log(getUrl());
  console.log($("#search").val());
  searchValue = $("#search").val();
  $.ajax({
    url: getUrl(),
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

// filtering  posts
$(document).on("click", ".common-filter", function () {
  console.log(getUrl());
  console.log($(this).data("id"));
  let value = $(this).data("id");
  if (value == undefined) {
    value = 1;
  }
  let url = getUrl();
  url += `&page=${value}`;
  console.log(url);
  $.ajax({
    url: url,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

// filtering  posts
$(document).on("click", ".user-filter", function () {
  console.log($(this).data("id"));
  let value = $(this).data("id");
  if (value == undefined) {
    value = 1;
  }
  let url = "/users/userslist";
  url += `?page=${value}`;
  console.log(url);
  $.ajax({
    url: url,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

// saved  posts
$(document).on("click", "#savedPosts", function () {
  console.log("clicked savedPosts");    

 

  $.ajax({
    url: `/posts/saved-posts`,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

// getting users list
$(document).on("click", "#users", function () {
  console.log("clicked users");

  $.ajax({
    url: `/users/userslist`,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

//opening create post modal
$(document).on("click", "#create", function () {
  $("#create-post-modal").modal("show");
});

$(document).on("click", "#report", function () {
  console.log("clicked report");
  $.ajax({
    url: `/report`,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

//sorting posts with title
$(document).on("click", ".postSort", function () {
  console.log("clicked titleSort");
  const titlesort = $(this).data("id");
  $.ajax({
    url: `/filter?sort=${titlesort}`,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

// sorting customers with registration date
$(document).on("click", "#registerdateSort", function () {
  console.log("clicked registerdateSort");
  const registrationsort = $(this).data("id");
  console.log(registrationsort);

  $.ajax({
    url: `/users/userslist?sort=${registrationsort}`,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

// user search
$(document).on("click", "#userSearch", function () {
  console.log("clicked userSearch");
  console.log($("#usersearchValue").val());

  const userSearch = $("#usersearchValue").val();

  $.ajax({
    url: `/users/userslist?search=${userSearch}`,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },  
  });
});

$(document).on("click", ".count", function () {


  $.ajax({
    url: `posts/${$(this).data("id")}/saved-by`,
    type: "GET",
    success: function (res) {

      $("div #modal-scrollable").replaceWith(res);
      $("#modal-scrollable").modal("show");
   
    },
    error: function (error) {
      console.log(error);
    },
  }); 
});

$(document).on("dblclick", ".imagePop", function () {
  $.ajax({
    url: `posts/${$(this).data("id")}/image-zoom-out`,
    type: "GET",
    success: function (res) {
      $("div #modal-team").replaceWith(res);
      $("#modal-team").modal("show");
   
    },
    error: function (error) {
      console.log(error);
    },
  }); 
});

$(document).on("click", ".comment", function () {
  console.log("comment");
  console.log($(this).data("id"));
  $("#comment-form #PostId-comment").replaceWith(`<input type="hidden" id="PostId-comment" name="PostId-comment" value="${$(this).data("id")}"></input>`)
  

  $.ajax({
    url: `posts/comments-data?postId=${$(this).data("id")}`,
    type: "GET",
    success: function (res) {
      console.log(res);
      // $("div #modal-scrollable-comment").replaceWith(res);
      $("#comment-list").html(res)
      $("#modal-scrollable-comment").modal("show");  
    },
    error: function (error) {
      console.log(error);
    },
  });
});
 