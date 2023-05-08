//saving posts
$(document).on("click", "#savePost", function () {
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
      
      toastr.success("Success")
      console.log(res);
    },
  });
});

//bringing data for editing a post from database
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
