$(document).ready(function () {
  console.log("hey");
  console.log($("form#editPosts").length);
    $("form#editPosts").validate({
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
          maxlength: 'postname should not exceed 30 characters'
        },
  
        image: {
          required: "select an image to upload",
        },
  
        description: {
          required: "a post must have it's description",
          maxlength: 'description must be of 300 characters'
        },
      },
      submitHandler: function (form) {
        console.log("aaaaa");
        if(!$(form).valid()){
          return null;
        }
      console.log("reached");
      // form = document.getElementById("createPosts");
      const formData = new FormData($(form)[0]);
  
        $.ajax({
          url: "posts/edit",
          type: "put",
          data: formData,
          processData: false,
          contentType: false,
          success: function (res) {
            console.log(res);
            flashMe(res)
          },
          error: function (error) {
            console.log(error);
          },
        });
        return false;
      },
    });
  });

$(document).on("click", "#archievePost", function () {
  console.log("clicked");
  let archieve = $(this);
  $.ajax({
    url: `/posts/${$(this).data("id")}`,
    type: "DELETE",
    success: function (res) {
      archieve.closest(".postBody").remove();
      flashMe(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

function getUrl() {

  let url = "/filter"
  const sort = $("#sort").val()
  const filter = $("#filter").val()
  const search = $("#search").val()
  if(filter){
    url += `?filter=${filter}`
  }
  if(sort){ 
  url += `&sort=${sort}`
  }
  if(search){
    url += `&search=${search}`
  }
    return url
}


$(document).on("change", ".common-filter", function () {

  // filtering  posts
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


$(document).on("click", ".common-filter", function () {
  // filtering  posts
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

$(document).on("click", ".common-filter", function () {
  // filtering  posts
  console.log(getUrl());
  console.log($(this).data("id"));
  let value = $(this).data("id")
  if(value == undefined)
  {
    value = 1
  }
  let url = getUrl()
  url += `&page=${value}`
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


$(document).on("click", ".user-filter", function () {
  // filtering  posts
  // console.log(getUrl());
  console.log($(this).data("id"));
  let value = $(this).data("id")
  if(value == undefined)
  {
    value = 1
  }
  let url = "/users/userslist"
  url += `?page=${value}`
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










$(document).on("click", "#savedPosts", function () {
  // saved  posts
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

$(document).on("click", "#users", function () {
  // getting users list
  console.log("clicked users");
  $.ajax({
    url: `/users/userslist`,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
      // console.log(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$(document).on("click", ".postSort", function () {
  //sorting posts with title
  console.log("clicked titleSort");
  const titlesort = $(this).data("id");
  $.ajax({
    url: `/filter?sort=${titlesort}`,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
      // console.log(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$(document).on("click", "#registerdateSort", function () {
  // sorting customers with registration date
  console.log("clicked registerdateSort");
  const registrationsort = $(this).data("id");
  console.log(registrationsort);

  $.ajax({
    url: `/users/userslist?sort=${registrationsort}`,
    type: "GET",
    success: function (res) {
      $("#main-row-div").html(res);
      // console.log(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$(document).on("click", "#userSearch", function () {
  // sorting customers with registration date
  console.log("clicked userSearch");
  console.log($("#usersearchValue").val());

  const userSearch = $("#usersearchValue").val();

  $.ajax({
    url: `/users/userslist?search=${userSearch}`,
    type: "GET",
    success: function (res) {
      //  $("#usersPartial").html(res)
      $("#main-row-div").html(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});
