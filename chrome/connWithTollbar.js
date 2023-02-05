// Listen for the popup script
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  console.log(sender.tab ?
				  "from a content script:" + sender.tab.url :
				  "from the extension");
	  if (request.greeting === "toggleVisibility") {
		sendResponse({farewell: houndToggleDisplay()});
	  }
		
	}
);

//Toggle hound display and return value to the popup script
function houndToggleDisplay() {
	houndToolbar = document.getElementById('hound_toolbarContainer').style.display;
	if (houndToolbar != 'none') {
		document.getElementById('hound_toolbarContainer').style.display = 'none';
		return "hide";
	} else {
		document.getElementById('hound_toolbarContainer').style.display = 'flex';
		return "show";
	}
}