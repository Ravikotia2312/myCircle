$(document).ready(function () {
  //editing posts
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
          toastr.success("post edited successfully");
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
        maxlength: 300,
      },
    },
    messages: {
      comment: {
        required: "comment field cannot be empty",
        maxlength: "maxlength 300 allowed",
      },
    },
    submitHandler: function (form) {
      console.log("++++++++++++++++reached++++++++++++++++");
      var $form = $(form);
      // const value = $("#comment-input").val();
      $.ajax({
        url: `posts/${$("#PostId-comment").val()}/create-comment`,
        type: "POST",
        data: $form.serialize(),

        success: function (res) {
          console.log(res);
          $("#modal-scrollable-comment").modal("toggle");
          toastr.success("comment successfully added");
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
      toastr.error("post Archieved");
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

//saves count
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

//image popup
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

//adding comments
$(document).on("click", ".comment", function () {
  console.log("comment");
  console.log($(this).data("id"));
  $("#comment-form #PostId-comment").replaceWith(
    `<input type="hidden" id="PostId-comment" name="PostId-comment" value="${$(
      this
    ).data("id")}"></input>`
  );

  $.ajax({
    url: `posts/comments-data?postId=${$(this).data("id")}`,
    type: "GET",
    success: function (res) {
      console.log(res);
      // $("div #modal-scrollable-comment").replaceWith(res);
      $("#comment-list").html(res);
      $("#modal-scrollable-comment").modal("show");
    },
    error: function (error) {
      console.log(error);
    },
  });
});

const socket = io("http://localhost:3000", {
  query: {
    userId: $("#socket-userId").val(),
  },
}); 

socket.on("postSave", (arg) => {
  console.log(socket.id);
  console.log(arg);
  toastr.info(arg.name + " " + "saved your post");

  $("#notifications-badge").replaceWith(
    `<span class="badge bg-red" id="notifications-badge">${arg.notificationsCount}</span>`
  );

  if(arg.notificationsCount <= 5)
  {
    $("#notifications-list").append(
      `<div class="notification-item list-group-item" style="width: 500px;" data-id="${arg.notificationBy._id}">
      <div class="row align-items-center">
        <div class="col-auto"><span class="status-dot status-dot-animated bg-red d-block"></span></div>
        <div class="col text-truncate">
          <a href="javascript:void(0)" class="text-body d-block" id="notified-by" style="text-decoration: none;"><h4>@${arg.notificationBy.savedByName}</h4></a>
          <div class="d-block text-mute d text-truncate mt-n1" id="notification-description">
            Your Post Was Saved by <b>${arg.name}</b> Just Now
          </div>
        </div>
        <div class="col-auto">
          <a href="javascript:void(0)" class="list-group-item-actions">
            <!-- Download SVG icon from http://tabler-icons.io/i/star -->
            <svg xmlns="http://www.w3.org/2000/svg" class="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
          </a>
        </div>
      </div>
    </div>`
    );
  }
});

$(document).on("click", ".notification-item",function () {
  const id = $(this).data("id");
  $(this).remove()
  $.ajax({
    url: `posts/${$(this).data("id")}/notification-panel-update`,
    type: "POST",
    success: function (res) {
      console.log(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
})

socket.on("notificationSeen", (arg) =>{
  console.log(arg);
  console.log(socket.id);

  $("#notifications-badge").replaceWith(
    `<span class="badge bg-red" id="notifications-badge">${arg}</span>`
  );
})