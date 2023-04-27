$(document).on("click", "#savePost", function () { //saving posts
  const createdBy = $(this).data("id");
  const postId = $(this).data("post");
  $.ajax({
    url: "/posts/savedPosts",
    type: "POST",
    data: {
      createdBy,
      postId,
    },
    success: function (res) {
      flashMe(res);
      console.log(res);
    },
  });
});

$(document).on("click", "#editpost", function () { //editing posts
  const postId = $(this).data("id");
  console.log(postId);
  $.ajax({
    url: `/editpost?value=${postId}`,
    type: "GET",

    success: function (res) {
      console.log(res.image);
      $("#editPosts #name").val(res.name);
      $("#editPosts #description").val(res.description);
      $("#editPosts #preview-selected-image").replaceWith(`<img id="preview-selected-image" src="/images/${res.image}">`);
      $("#editPosts #custId").replaceWith(`<input type="hidden" id="custId" name="custId" value="${res.id}">`);
      $("#edit-post-modal").modal("show");
    },
  });
});
