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
	// Web Service Call for ad details.
	chrome.extension.sendMessage(daftId, function(reply){
	    console.log("DaftDrop response for daftId: " + reply);
	    insertDaftDropDiv(function(){
	    	parseAdInfo(reply, function(details){
		    	console.log("tr:" + document.getElementById('original-price-value'));
		    	updateDaftDropDiv(details);
	    	});
	    });
	});
}

function insertDaftDropDiv(callback){
	var addressBox = document.getElementById('address_box');

	var dropDiv = document.createElement('div');
	dropDiv.setAttribute('id', 'drop-div');

	/*
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
    */

	var clearfixDiv = document.createElement('div');
	clearfixDiv.setAttribute('class','clearfix');
	addressBox.appendChild(clearfixDiv);
	addressBox.appendChild(document.createElement('h2'))
    addressBox.appendChild(dropDiv);
    load('content.html', function(response){
    	document.getElementById('drop-div').innerHTML = response;
    	callback();
    });
}

function load(fileName, callback){
	var contentLocation = chrome.extension.getURL(fileName);
    var xhr = new XMLHttpRequest();
	xhr.open('GET', contentLocation, true);
	xhr.onreadystatechange = function() {
	    if (this.readyState!==4) return;
	    if (this.status!==200) return; // or whatever error handling you want
	    console.log("RESPONSE: " + this.responseText);
	    callback(this.responseText);
	};
	xhr.send();
}

function updateDaftDropDiv(details){
	document.getElementById('original-price-value').innerText = details['originalPrice'];
	document.getElementById('change-percentage-value').innerText = details['changePercentageSpan'];
}

function parseAdInfo(webServiceResponse, callback){
	details = {};

	// Add div to page here using info in reply.
	var daftDropResponseAttribs = webServiceResponse.split(',');
	/*
	for(var i = 0; i < daftDropResponseAttribs.length; i++){
		console.log(i + " : " + daftDropResponseAttribs[i]);
	}
	*/
	//var originalPriceString = "€" + numberWithCommas(daftDropResponseAttribs[2]);
	
	details['currentPrice'] = daftDropResponseAttribs[8];
	details['originalPrice'] = daftDropResponseAttribs[2];

	getChangePercentageHtml(details['currentPrice'], details['originalPrice'], function(response){
		details['changePercentageSpan'] = response;
	});

	numberWithCommas(daftDropResponseAttribs[2], function(prettifiedOriginalPrice){
		details['originalPrice'] = "€" + prettifiedOriginalPrice;
	});
	console.log("Change: " + details['changePercentageSpan']);
	callback(details);
	//console.log("Current Price is: €" + numberWithCommas(daftDropResponseAttribs[8]));
	//var onMarketSince = new Date(daftDropResponseAttribs[46].split('/')[1].replace(/\D/g,''));
	//console.log("On Market Since: " + daftDropResponseAttribs[46].split('/')[1].replace(/\D/g,''));
	//insertDaftDropDiv(originalPriceString, changeStringSpan);
}

function getChangePercentageHtml(currentPrice, originalPrice, callback){
	if (originalPrice > currentPrice){
		var changeString = "-" + (((originalPrice - currentPrice)/originalPrice)*100).toFixed(2) + "%";
		document.getElementById('change-percentage-value').setAttribute('class', 'dropped');
	}
	else if(originalPrice < currentPrice){
		var changeString = "+" + (((currentPrice - originalPrice)/currentPrice)*100).toFixed(2) + "%";
		document.getElementById('change-percentage-value').setAttribute('class', 'increased');
	}
	else{
		var changeString = "None";
	}
	callback(changeString);
}
function numberWithCommas(x, callback) {
    callback(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}