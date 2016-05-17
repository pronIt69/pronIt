function getImageUrls(searchUrl, callback) {
	var x = new XMLHttpRequest();
	x.open('GET', searchUrl);
	x.onload = function() {
		callback(x.responseText);
	};
	x.onerror = function() {
		// alert('Network error.');
	};
	x.send();
}

function parseResponse(response){
	var gifUrls = [];
	var indexOfGif = 0;
	var beginningOfString;
	while(true){
		indexOfGif = response.indexOf(".gif\"", indexOfGif + 1);
		if(indexOfGif == -1){
			break;
		}
		beginningOfString = response.lastIndexOf("\"", indexOfGif);
		gifUrls[gifUrls.length] = response.substring(beginningOfString + 1, indexOfGif + 4);
	}

	return gifUrls;
}

function run(enabled, firstRun){
	if(enabled == 1){
		getImageUrls("http://madporngifs.tumblr.com/archive", function(responseText) {
			var totalGifUrls = parseResponse(responseText);
			var imagesOnSite = document.images;

			for(var i = 0, j = 0; i < imagesOnSite.length; i++, j++) {
				if(j == totalGifUrls.length){
					j = 0;
				}
				imagesOnSite[i].src = totalGifUrls[j];
			}

			var aTag = document.getElementsByTagName('a');
			for(var i = 0, j = 0; i < aTag.length; i++){
				if(aTag[i].getAttribute("style") != null){
					if(aTag[i].getAttribute("style").search("background") > -1){
						aTag[i].style.background = "url(\'" + totalGifUrls[j] + "\')";
						j++;
						if(j == totalGifUrls.length){
							j = 0;
						}
					}
				}
			}

			var div = document.getElementsByTagName('div');
			for(var i = 0, j = 0; i < div.length; i++){
				if(div[i].getAttribute("style") != null){
					if(div[i].getAttribute("style").search("background") > -1){
						div[i].style.background = "url(\'" + totalGifUrls[j] + "\')";
						j++;
						if(j == totalGifUrls.length){
							j = 0;
						}
					}
				}
			}
			});
	}else if(firstRun == 0){
		window.location.reload();
	}else{
		return;
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	run(request, 0);
});

chrome.runtime.sendMessage({getPronEnableStatus: "True"}, function(response) {
	if(response.pronEnableStatus == 1 || response.pronEnableStatus == 0){
		run(response.pronEnableStatus, 1);
	}
});