chrome.browserAction.onClicked.addListener(function(tab) {
	if(localStorage["enablePron"] == 1){
		chrome.browserAction.setIcon({
  			path : "icons/pronDisable_19.png"
		});
		localStorage["enablePron"] = 0;
	}else{
		chrome.browserAction.setIcon({
  			path : "icons/pronEnable_19.png"
		});
		localStorage["enablePron"] = 1;
	}
	chrome.tabs.sendMessage(tab.id, localStorage["enablePron"]);
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.getPronEnableStatus == "True"){
			if(localStorage["enablePron"] == null){ // first time the user runs the extension.
				localStorage["enablePron"] = 1;
			}
			sendResponse({pronEnableStatus: localStorage["enablePron"]});
		}
	});