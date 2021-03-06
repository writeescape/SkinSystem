/*
	Skin-System
	https://github.com/riflowth/SkinSystem
*/

$(document).ready(function(){
	/* Upload Skin Form */
	$("#form").ajaxForm(function(){
		var formData = new FormData($("form")[0]);
		console.log('------------------------------');

		$.ajax({
			type: "post",
			url: "lib/uploader.php",
			cache: false,
			contentType: false,
			processData: false,
			data: formData,
			dataType: "json",
			encode: true,
		}).done(function(respond){
			//$("#respond").html(respond); //Debug in HTML
			if(respond.success){
				console.log(respond);
				console.log('Uploading file - success');
				toastr.success('Have fun!', 'Upload skin successfully');
				location.reload();	
			}
			else if(!respond.success){
				toastr.options.progressBar = true;
				toastr["error"]("Failed to upload file! Try again.", "Error");
				console.log('Uploading file - fail');
				console.log(respond);
			}
		}).fail(function(respond){
			toastr.options.progressBar = true;
			toastr["error"]("Failed to connect to the server", "Error");
			console.log('Uploading file - fail');
			console.log(respond);
		});
	});

	/* Initialize Skin Render */
	console.log('------------------------------');
	console.log('Skin renderer');
	var skinRender = new SkinRender({
		autoResize: true,
		controls:{
			enabled: true,
			pan: false,
		},
		camera: {
            x: 15,
            y: 25,
            z: 24,
			target: [0, 17, 0]
        },
		canvas:{
			height: $("#skinrender-container")[0].offsetHeight - 50,
			width: $("#skinrender-container")[0].offsetWidth
		}
	}, $("#skinrender-container")[0]);

	/* Variables NOTE: Don't change ! */
	var slim = false;
	var skinURL;
	var withURL = false;

	/* File Input -- Change Event */
	$("#input-file").change(function(event){
		if($("#input-file")[0].files.length === 0){ return; }

		skinURL = URL.createObjectURL(event.target.files[0]);
		console.log('|_ Skin url');
		console.log(skinURL);

		skinChecker(function() {
			$("#input-skintype-alex").prop('checked', slim);
			$("#input-skintype-steve").prop('checked', !slim);

			rerender();
		});
	});

	/* URL Input -- Change Event */
	console.log('------------------------------');
	console.log('URL input change');
	$("#input-url").change(function(event){
		if(!$("#input-url").val()){ return; }

		skinURL = $("#input-url").val();
		console.log('|_ Skin Url');
		console.log(skinURL);

		skinChecker(function() {
			$("#input-skintype-alex").prop('checked', slim);
			$("#input-skintype-steve").prop('checked', !slim);

			rerender();
		});
	});

	/* Skintype Input -- Change Event */
	$("[id^=input-skintype-]").change(function(event){
		slim = !slim;
		rerender();
	});

	/* Uploadtype Input -- Change Event */
	$("[id^=input-uploadtype-]").change(function(event){
		withURL = !withURL;
		if(withURL === true){
			$("#upload-url").css("display", "block");
			$("#upload-file").css("display", "none");
			$("#input-file").prop('required', false);
			$("#input-url").prop('required', true);
		}
		else if(withURL === false){
			$("#upload-file").css("display", "block");
			$("#upload-url").css("display", "none");
			$("#input-file").prop('required', true);
			$("#input-url").prop('required', false);
		}
	});

	/* SkinChecker Function */
	console.log('------------------------------');
	console.log('Skin checker');

	function skinChecker(callback){
		var image = new Image();
		image.crossOrigin = "Anonymous";
		image.src = skinURL;

		image.onload = function(){
			var detectCanvas = document.createElement("canvas");
			var detectCtx = detectCanvas.getContext("2d");
			detectCanvas.width = image.width;
			detectCanvas.height = image.height;
			detectCtx.drawImage(image, 0, 0);

			console.log("|_ Slim Detection:");

			var px1 = detectCtx.getImageData(46, 52, 1, 12).data;
			var px2 = detectCtx.getImageData(54, 20, 1, 12).data;
			var allTransparent = true;
			for (var i = 3; i < 12 * 4; i += 4) {
				if (px1[i] === 255) {
					allTransparent = false;
					break;
				}
				if (px2[i] === 255) {
					allTransparent = false;
					break;
				}
			}
			console.log(allTransparent);

			slim = allTransparent;

			if(callback !== undefined){
				callback();
			}
		}
	}

	/* Initialize Skin Render */
	console.log('------------------------------');
	console.log('Skin render');
	function rerender(){
		console.log("|_ Render Skin!");
		if(skinURL === undefined){
			return;
		}

		skinRender.reset();
		skinRender.render({
			url: skinURL,
			slim: slim
		});
	}
});
