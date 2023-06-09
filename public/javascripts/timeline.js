$(document).ready(function () {
  //jquery for editing the post which are not archieved
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

//makes post archieved
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

//this click access the filter class which includes mine, others and all category
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

//this click access the filter class which includes mine, others and all category
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

//this click access the filter class which includes mine, others and all category
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

//this click access the filter class which includes mine, others and all category
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

// this click navigates to the savedposts section of the application in which user can access those posts which was saved by him/her
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

// getting list of registered users
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

//this click help user in generating a post as this click opens a modal for creating a post
$(document).on("click", "#create", function () {
  $("#create-post-modal").modal("show");
});

//this clicks navigates the user to a chart which shows the overall activity of the application which includes total uploaded posts and total saved posts
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

// to search a user who has been already registered
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

//shows the overall users who saved the particular
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

//image popup for detailed view of image once user double clicks the post image
$(document).on("dblclick", ".imagePop", function () {
  $.ajax({
    url: `posts/${$(this).data("id")}/image-zoom-out`,
    type: "GET",
    success: function (res) {
      console.log(res);
      $("#modal-team").replaceWith(res);
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

//declaring socket to listen on localhost 3000
const socket = io({
  query: {
    userId: $("#socket-userId").val(),
    groupId: $("#socket-userId").data("group"),
  },
});

//event for a user saving a post
socket.on("postSave", (arg) => {
  console.log(socket.id);
  console.log(arg);
  toastr.info(arg.name + " " + "saved your post");

  $("#notifications-badge").replaceWith(
    `<span class="badge bg-red" id="notifications-badge">${arg.notificationsCount}</span>`
  );

  if (arg.notificationsCount <= 5) {
    $("#notifications-list").append(
      `<div class="notification-item list-group-item" style="width: 500px;" data-id="${arg.notificationBy[0]._id}">
      <div class="row align-items-center">
        <div class="col-auto"><span class="status-dot status-dot-animated bg-red d-block"></span></div>
        <div class="col text-truncate">
          <a href="javascript:void(0)" class="text-body d-block" id="notified-by" style="text-decoration: none;"><h4>@${arg.notificationBy[0].savedByName}</h4></a>
          <div class="d-block text-mute d text-truncate mt-n1" id="notification-description">
            Your Post Was Saved by <b>${arg.name}</b> Just Now
          </div>
        </div>
        <div class="col-auto">
          <a href="javascript:void(0)">
            <!-- Download SVG icon from http://tabler-icons.io/i/star -->
            <span class="post-indicator avatar me-3 rounded" data-id="${arg.id}" style="background-image: url(/images/${arg.image})"></span>
          </a>
        </div>
      </div>
    </div>`
    );
  }
});

//making notification clear once user has noticed it.
$(document).on("click", ".notification-item", function () {
  //removing notification when user clicks the notification item and changing isSeen status to true

  const id = $(this).data("id");
  $(this).remove();
  $.ajax({
    url: `posts/${id}/notification-panel-update`,
    type: "POST",
    success: function (res) {
      console.log(res);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

//this click will open a modal for more details of post which was being saved
$(document).on("click", ".post-indicator", function () {
  const postId = $(this).data("id");
  console.log("clicked post-indicator");
  console.log(postId);
  $.ajax({
    url: `posts/${postId}/notification-posts-access`,
    type: "POST",
    success: function (res) {
      console.log(res.data.postImg);
      $("#post-notification-image").replaceWith(
        `<img  style="width:300px; height:300px" src="/images/${res.data.postImg}" id="post-notification-image"/>`
      );
      $("#post-notification-title").replaceWith(
        `<h3 id="post-notification-title">${res.data.postName}</h3>`
      );
      $("#post-notification-description").replaceWith(
        `<p id="post-notification-description">${res.data.description}</p>`
      );
      $("#modal-full-width").modal("show");
    },
    error: function (error) {
      console.log(error);
    },
  });
});

//updating the count of badge once notification is removed from the list
socket.on("notificationSeen", (arg) => {
  console.log(arg);
  console.log(socket.id);

  $("#notifications-badge").replaceWith(
    `<span class="badge bg-red" id="notifications-badge">${arg}</span>`
  );
});

$(document).on("click", "#chat-icon", function () {
  $.ajax({
    url: `/chats`,
    type: "GET",
    success: function (res) {
      $("#chat-badge").replaceWith(
        `<span class="badge bg-red" id="chat-badge" hidden></span>`
      );
      $("#chat-modal").replaceWith(res);
      $("#chat-modal").modal("show");
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$(document).on("click", ".user", function () {
  $(this).find("#chat-badge-chatbox").remove();
  const userId = $(this).data("id");
  // $("#chat-list").empty();
  $.ajax({
    url: `chats-current-user?userId=${userId}`,
    type: "GET",
    success: function (res) {
      // console.log(res.chatCurrentUser._id);
      if (res.chatCurrentUser.profilePic) {
        $("#chat-margin")
          .replaceWith(`<div class="col-1" id="chat-margin" style="display:contents">
        <!-- Photo -->
        <img src="/uploads/${res.chatCurrentUser.profilePic}" class = "rounded-circle" height="63" width="63" > 
      </div>`);

        $("#user-name").replaceWith(`<div class="col" id="user-name">
      <div class="card-body" style="padding : 20px">
      <h2 class="card-title">${res.chatCurrentUser.firstName} ${res.chatCurrentUser.lastName}</h2>
      </div>
      </div>`);

        $("#send-button")
          .replaceWith(`<button class="input-group-text ms-2 btn" id="send-button" data-id=${res.chatCurrentUser._id}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-telegram" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
     <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
     </svg>Send</button>`);
      } else {
        $("#chat-margin").replaceWith(`<div class="col-1" id="chat-margin">
        <!-- Photo -->
        <img src="/uploads/blank-profile-picture-973460_640.jpg" class = "rounded-circle" height="63" width="63" >
      </div>`);

        $("#user-name").replaceWith(` <div class="col" id="user-name">
      <div class="card-body" style="padding : 20px">
        <h2 class="card-title">${res.chatCurrentUser.firstName} ${res.chatCurrentUser.lastName}</h2>
      </div>
      </div>`);

        $("#send-button")
          .replaceWith(`<button class="input-group-text ms-2 btn" id="send-button" data-id=${res.chatCurrentUser._id}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-telegram" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
          </svg>Send</button>`);
      }

      $(".chat-listing")
        .html(`<div style="overflow: scroll; height: 800px;" id="chat-list">
       </div>`);

      for (let value of res.chatCurrentUserData) {
        if (value.createdBy == res.loginUser) {
          $("#chat-list").append(
            `<div class="bg-dark  m-3 p-2 text-light"style="float:right; margin-top: 10px; max-width: 500px; min-height : auto; overflow-wrap: break-word; clear:both; border-radius: 15px; border-top-right-radius: 1px;"><b>${
              value.message
            }</b><div style="float:right;margin:10px 0px 0px 10px">${moment(
              value.createdOn
            ).format("h:mm")}</div></div>`
          );
        } else {
          $("#chat-list").append(
            `<div class="bg-light m-3 p-2 text-dark" style="float:left; margin-top: 10px; max-width: 500px; min-height : auto; overflow-wrap: break-word;clear:both; border-radius: 15px; border-top-left-radius: 1px;"><b>${
              value.message
            }</b><div style="float:right;margin:10px 0px 0px 10px">${moment(
              value.createdOn
            ).format("h:mm")}</div></div>`
          );
        }
      }

      $(".input-group")
        .html(`<input type="text" class="form-control ms-3" placeholder="Your message here" aria-label="Your message here" aria-describedby="basic-addon2" id="message-input">
      <div class="input-group-append">
      <button class="shadow input-group-text ms-2 btn bg-blue" id="send-button" data-id=${res.chatCurrentUser._id}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-telegram" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
     <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
     </svg>Send</button>
      </div>`);
    },
    error: function (error) {
      console.log(error);
    },
  });
});
$(document).on("click", "#send-button", function () {
  console.log("clicked send-button");
  // console.log();
  const message = $("#message-input").val();
  let url = `/conversation`;
  if ($(this).data("id")) {
    const userId = $(this).data("id");
    url += `?userid=${userId}`;
    console.log("inside userId");
  }
  if ($(this).data("group-id")) {
    const groupId = $(this).data("group-id");
    url += `?groupid=${groupId}`;
    console.log("inside GroupId");
  }
  console.log(url);

  $.ajax({
    url: url,
    type: "POST",
    data: {
      message,
    },
    success: function (res) {
      console.log(res);
      $("#chat-list").append(
        `<div class="bg-dark m-3 p-2 text-light"style="float:right; margin-top: 10px; max-width: 500px; clear:both; overflow-wrap: break-word; border-radius: 15px; border-top-right-radius: 1px;" >
        <h2>You</h2>
        <b>${res.data}</b><br>
        <div style="float : right">${moment(Date.now()).format("h:mm")}
      </div>`
      );
    },
    error: function (error) {
      console.log(error);
    },
  });

  $("#message-input").val("");
});

socket.on("message", (arg) => {
  console.log(socket.id);
  console.log(arg);
  $("#chat-list").append(
    `<div class="bg-light m-3 p-2 text-dark" style="float:left; margin-top: 10px; max-width: 500px; clear:both; border-radius: 15px; border-top-left-radius: 1px;">
    <b>${arg.message}</b><br>
    <div style="float:right;margin:10px 0px 0px 10px">${moment(
      arg.createdOn
    ).format("h:mm")}
   </div>`
  );
});

socket.on("groupMessage", (arg) => {
  console.log(socket.id);
  console.log(arg); 

  $("#chat-list").append(
    `<div class="bg-light m-3 p-2 text-dark" style="float:left; margin-top: 10px; max-width: 500px; clear:both; border-radius: 15px; border-top-left-radius: 1px;">
    <b>${arg.message}</b><br>
    <div style="float:right;margin:10px 0px 0px 10px">${moment(
      arg.createdOn
    ).format("h:mm")}
   </div>`
  );
});

socket.on("unNotifiedMsgCount", (arg) => {
  console.log(socket.id);
  console.log(arg);
  $("#chat-badge").replaceWith(
    `<span class="badge bg-red" id="chat-badge">${arg}</span>`
  );

  // $("#chat-badge-chatbox").replaceWith(`<span class="badge bg-red ms-3" id="chat-badge-chatbox">${arg}</span>`)
  if (arg == 1) toastr.info(`you have ${arg} message in Chat`);
  else {
    toastr.info(`you have ${arg} messages in Chat`);
  }
});

$(document).on("click", "#create-group-button", function () {
  console.log("clicked create group button");
  $.ajax({
    url: `/group-users-listing`,
    type: "GET",
    success: function (res) {
      console.log(res);
      $("#modal-group-creation").replaceWith(res);
      $("#modal-group-creation").modal("show");
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$(document).on("click", "#group-creation-button", function () {
  let userId = [];
  $('input[name="add-users-toggle"]:checked').each(function () {
    let users = $(this).data("id");
    userId.push(users);
  });
  console.log(userId);
  let groupName = $("#group-name-input").val();
  $.ajax({
    url: `/creating-groups`,
    type: "POST",
    data: {
      group: groupName,
      members: JSON.stringify(userId),
    },
    success: function (res) {
      toastr.success("group successfully Created");
      $("#modal-group-creation").modal("hide");
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$(document).on("click", ".group-chat", function () {
  let groupId = $(this).data("group-id");

  $.ajax({
    url: `chats-current-group?groupId=${groupId}`,
    type: "GET",
    success: function (res) {
      console.log(res);

      $("#chat-margin")
        .replaceWith(`<div class="col-1" id="chat-margin" style="display:contents">
        <!-- Photo -->
        <img src="/images/groupIcon.jpg" class = "rounded-circle" height="63" width="63" > 
      </div>`);
      $("#user-name").replaceWith(`<div class="col" id="user-name">
      <div class="card-body" style="padding : 20px">
      <h2 class="card-title">${res.chatCurrentGroup.groupName}</h2>
      </div>
      </div>`);

      $(".input-group")
        .html(`<input type="text" class="form-control ms-3" placeholder="Your message here" aria-label="Your message here" aria-describedby="basic-addon2" id="message-input">
      <div class="input-group-append">
      <button class="shadow input-group-text ms-2 btn bg-blue" id="send-button" data-group-id=${res.chatCurrentGroup._id}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-telegram" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
     <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
     </svg>Send</button>
      </div>`);

      $(".chat-listing")
        .html(`<div style="overflow: scroll; height: 800px;" id="chat-list">
     </div>`);

      for (let value of res.chatCurrentGroupData) {
        if (value.createdBy == res.loginUser) {
          $("#chat-list").append(
            `<div class="bg-dark  m-3 p-2 text-light"style="float:right; margin-top: 10px; max-width: 500px; min-height : auto; overflow-wrap: break-word; clear:both; border-radius: 15px; border-top-right-radius: 1px;">
            <h2>You</h2>
            <b>${value.message}</b>
            <div style="float:right;margin:10px 0px 0px 10px">${moment(
              value.createdOn
            ).format("h:mm")}</div></div>`
          );
        } else {
          $("#chat-list").append(
            `<div class="bg-light m-3 p-2 text-dark" style="float:left; margin-top: 10px; max-width: 500px; min-height : auto; overflow-wrap: break-word;clear:both; border-radius: 15px; border-top-left-radius: 1px;">
            <h2>${value.users.firstName}</h2>
            <b>${value.message}</b>
            <div style="float:right;margin:10px 0px 0px 10px">${moment(
              value.createdOn
            ).format("h:mm")}</div></div>`
          );
        }
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
});
