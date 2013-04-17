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

function insertDaftDropDiv(originalPriceString, changeStringSpan){
	var addressBox = document.getElementById('address_box');

	var dropDiv = document.createElement("div");
	dropDiv.setAttribute("style", "width: 25%");

	var clearfixDiv = document.createElement("div");
	clearfixDiv.setAttribute("class","clearfix");

	var dropBarSpan = document.createElement("span");
	dropBarSpan.text = "|";

	var hLine = document.createElement("h2");		// daft.ie's style adds a nice horizontal bar after h2 divs \o/

    var dropTitleDiv = document.createElement("div");
    dropTitleDiv.setAttribute('id', 'daft-drop');
    dropTitleDiv.innerHTML = "<div><span style=\"float:left;\" class=\"original_title\">Original Price</span><span class=\"bar\">|</span><span style=\"float:right;\" class=\"change_title\">Change</span></div>";

    var dropOriginalPriceSpan = document.createElement("span");
    dropOriginalPriceSpan.setAttribute("class", "original_info");
    dropOriginalPriceSpan.setAttribute("style", "float: left;");
    dropOriginalPriceSpan.innerText = originalPriceString;

    addressBox.appendChild(clearfixDiv);
    addressBox.appendChild(hLine);
    dropDiv.appendChild(dropTitleDiv);
    dropDiv.appendChild(clearfixDiv);
    dropDiv.appendChild(dropOriginalPriceSpan);
    dropDiv.appendChild(dropBarSpan);
    dropDiv.appendChild(changeStringSpan);

    addressBox.appendChild(dropDiv);
}

function updateDaftDropDiv(daftDropResponse){
	// Add div to page here using info in reply.
	var daftDropResponseAttribs = daftDropResponse.split(',');
	for(var i = 0; i < daftDropResponseAttribs.length; i++){
		console.log(i + " : " + daftDropResponseAttribs[i]);
	}
	var originalPriceString = "€" + numberWithCommas(daftDropResponseAttribs[2]);
	var originalPrice = daftDropResponseAttribs[2];
	var currentPrice = daftDropResponseAttribs[8];
	

	if (originalPrice > currentPrice){
		var changeString = "-" + (((originalPrice - currentPrice)/originalPrice)*100).toFixed(2) + "%";
		var changeStringSpan = document.createElement("h3");
		changeStringSpan.setAttribute("class", "change_info");
		changeStringSpan.setAttribute("style", "color: green; float: right;");
		changeStringSpan.innerText = changeString;
	}
	else if(originalPrice < currentPrice){
		var changeString = "+" + (((currentPrice - originalPrice)/currentPrice)*100).toFixed(2) + "%";
		var changeStringSpan = document.createElement("h4");
		changeStringSpan.setAttribute("class", "change_info");
		changeStringSpan.setAttribute("style", "color: red; float: right;");
		changeStringSpan.innerText = changeString;
	}
	else{
		var changeString = "None";
		var changeStringSpan = document.createElement("h4");
		changeStringSpan.setAttribute("class", "change_info");
		changeStringSpan.setAttribute("style", "color: red; float: right;");
		changeStringSpan.innerText = changeString;
	}

	console.log("Change: " + changeString);
	//console.log("Current Price is: €" + numberWithCommas(daftDropResponseAttribs[8]));
	//var onMarketSince = new Date(daftDropResponseAttribs[46].split('/')[1].replace(/\D/g,''));
	//console.log("On Market Since: " + daftDropResponseAttribs[46].split('/')[1].replace(/\D/g,''));
	insertDaftDropDiv(originalPriceString, changeStringSpan);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}