var dropDiv = document.createElement('div');
dropDiv.setAttribute('id', 'daft-drop');
dropDiv.innerHTML = 'TEST DIV';

var clearFix = document.createElement('div');
clearFix.setAttribute('class', 'clearfix');

$(document).ready(function(){
	var addressBox = $('#address_box');
	console.log(addressBox);
	if (addressBox != ''){
		console.log('Appending div.');
		addressBox.append(clearFix);
		addressBox.append(dropDiv);
		console.log('Finished appending div.')
		getHomeInfo(687825);
	}
});

function getHomeInfo(daftId){
	// Web Service Call for templates.
	chrome.extension.sendMessage(daftId, function(reply){
	    console.log("DaftDrop response for daftId: " + reply);
	    // Add div to page here using info in reply.
	});
}