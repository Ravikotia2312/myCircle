$(document).ready(function () {
	$("#form").validate({
		rules: {
		  email: {
			required: true,
		  },
		  password: {
			required: true,
		  },
		},
		messages: {
		  email: {
			required: "Enter your Email",
		  },
	
		  Password: { required: "Enter your Password" },
		},
		submitHandler:  function (form) {
			// jquery for submit button
			console.log("clicked");
			form.submit()
		}}
	)
		  })
	
		
		


