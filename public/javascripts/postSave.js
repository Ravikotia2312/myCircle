  //saving posts
  $(document).on("click", "#savePost", function () {
    // console.log($(this).data("id"), $("#socket-userId").val());
    const createdBy = $(this).data("id");
    const postId = $(this).data("post");
    // socket.emit("test",createdBy);

    $.ajax({
      url: "/posts/savedPosts",
      type: "POST",
      data: {
        createdBy,
        postId,
      },
      success: function (res) {
        console.log(res);
        if (res.type == "success") {
          toastr.info("post unsaved");
          $(`.${postId}`).replaceWith(
            ` <span class="${postId}">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-down-line" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M15 12h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-6h6v6z"></path>
          <path d="M15 3h-6"></path>
          </svg>
            </span>`
          );
          $(`#Status-${postId}`).replaceWith(
            `<span style="color: azure;" id="Status-${postId}">Save</span>`
          );

          $(`#count-${postId}`).replaceWith(
            `<span class="count" data-id="${postId}" id="count-${postId}"> Saved by ${res.data}</span>`
          );

        }

        if (res.type == "successSave") {
         
          toastr.success("post saved successfully");
          $(`.${postId}`).replaceWith(
            `<span class="${postId}">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-down-lines-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M9 8l-.117 .007a1 1 0 0 0 -.883 .993v1.999l-2.586 .001a2 2 0 0 0 -1.414 3.414l6.586 6.586a2 2 0 0 0 2.828 0l6.586 -6.586a2 2 0 0 0 .434 -2.18l-.068 -.145a2 2 0 0 0 -1.78 -1.089l-2.586 -.001v-1.999a1 1 0 0 0 -1 -1h-6z" stroke-width="0" fill="currentColor"></path>
          <path d="M15 2a1 1 0 0 1 .117 1.993l-.117 .007h-6a1 1 0 0 1 -.117 -1.993l.117 -.007h6z" stroke-width="0" fill="currentColor"></path>
          <path d="M15 5a1 1 0 0 1 .117 1.993l-.117 .007h-6a1 1 0 0 1 -.117 -1.993l.117 -.007h6z" stroke-width="0" fill="currentColor"></path>
          </svg>
          </span>`
          );

          $(`#Status-${postId}`).replaceWith(
            `<span style="color: azure;" id="Status-${postId}">Unsave</span>`
          );

          $(`#count-${postId}`).replaceWith(
            `<span class="count" data-id="${postId}" id="count-${postId}"> Saved by ${res.data}</span>`
          );
          
         

        }
      },
    });
  });

  //bringing data for editing a post from database
  $(document).on("click", "#editpost", function () {
    //editing posts
    const postId = $(this).data("id");
    console.log(postId);
    $.ajax({
      url: `/editpost?value=${postId}`,
      type: "GET",

      success: function (res) {
        console.log(res.image);
        $("#editPosts #name").val(res.name);
        $("#editPosts #description").val(res.description);
        $("#editPosts #preview-selected-image").replaceWith(
          `<img id="preview-selected-image" src="/images/${res.image}">`
        );
        $("#editPosts #custId").replaceWith(
          `<input type="hidden" id="custId" name="custId" value="${res.id}">`
        );
        $("#edit-post-modal").modal("show");
      },
    });
  });
