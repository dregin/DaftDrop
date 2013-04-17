var dropDivTEST = document.createElement('div');
dropDivTEST.setAttribute('id', 'daft-drop');
dropDivTEST.innerHTML = 'TEST DIV';

var clearFix = document.createElement('div');
clearFix.setAttribute('class', 'clearfix');

document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		var addressBox = document.getElementById('address_box');
		//console.log(addressBox);
		if (addressBox != ''){
			console.log('Appending div.');
			//addressBox.append(clearFix);
			//addressBox.append(dropDiv);
			console.log('Finished appending div.');
			var daftId = document.getElementById('ad_id').value;
			console.log("daftId: " + daftId);
			getHomeInfo(daftId);		//ad_id is already in daft.ie's JS \o\
		}
	}
}

function getHomeInfo(daftId){
	// Web Service Call for templates.
	chrome.extension.sendMessage(daftId, function(reply){
	    console.log("DaftDrop response for daftId: " + reply);
	    updateDaftDropDiv(reply);
	});
}

function insertDaftDropDiv(){
	var hLine = document.createElement("h2");		// daft.ie's style adds a nice horizontal bar after h2 divs \o/
    var dropDiv = document.createElement("div");
    dropDiv.setAttribute('id', 'daft-drop');
}

function updateDaftDropDiv(daftDropResonse){
	// Add div to page here using info in reply.
}