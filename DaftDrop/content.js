var clearFix = document.createElement('div');
clearFix.setAttribute('class', 'clearfix');

document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		var addressBox = document.getElementById('address_box');
		if (addressBox != ''){
			var daftId = document.getElementById('ad_id').value;
			getHomeInfo(daftId);		//ad_id is already in daft.ie's JS \o\
		}
	}
}

function getHomeInfo(daftId){
	// Web Service Call for ad details.
	chrome.extension.sendMessage(daftId, function(reply){
	    insertDaftDropDiv(function(){
	    	parseAdInfo(reply, function(details){
		    	updateDaftDropDiv(details);
	    	});
	    });
	});
}

function insertDaftDropDiv(callback){
	var addressBox = document.getElementById('address_box');

	var dropDiv = document.createElement('div');
	dropDiv.setAttribute('id', 'drop-div');

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
	    callback(this.responseText);
	};
	xhr.send();
}

function updateDaftDropDiv(details){
	if(details !== 'Not Collected Yet'){
		document.getElementById('original-price-value').innerText = details['originalPrice'];
		document.getElementById('change-percentage-value').innerText = details['changePercentageSpan'];
		document.getElementById('change-percentage-date-added-value').innerText = details['dateAdded'];
		document.getElementById('change-percentage-date-last-value').innerText = details['dateUpdated'];
	}
	else{
		document.getElementById('drop-div').innerText = 'Information for this advert hasn\'t been collected by daftdrop.com yet.';
	}
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

	// Get Price Information
	if (daftDropResponseAttribs.length > 4){
		details['originalPrice'] = daftDropResponseAttribs[2];
		var numPrices = getNumberOfPrices(daftDropResponseAttribs);
		if (details['originalPrice'] !== '-1'){
			details['currentPrice'] = getCurrentPrice(daftDropResponseAttribs);
			getChangePercentageHtml(details['currentPrice'], details['originalPrice'], function(response){
				details['changePercentageSpan'] = response;
			});
			numberWithCommas(details['originalPrice'], function(prettifiedOriginalPrice){
				details['originalPrice'] = "€" + prettifiedOriginalPrice;
			});

			// Get Date information
			getDate(daftDropResponseAttribs[5], function(response){
				details['dateAdded'] = response;
			});
			if(numPrices === 2){
				getDate(daftDropResponseAttribs[11], function(response){
					details['dateUpdated'] = response;
				});
			}
			else if(numPrices > 2){
				getDate(daftDropResponseAttribs[5 + (6 * (numPrices -1))], function(response){
					details['dateUpdated'] = response;
				});
			}
			else{
				details['dateUpdated'] = 'Never';
			}
			callback(details);
		}
		else{
			details['originalPrice'] = 'P.O.A.';
			details['changePercentageSpan'] = 'N/A';
			details['currentPrice'] = getCurrentPrice(daftDropResponseAttribs);
			getDate(daftDropResponseAttribs[5], function(response){
				details['dateAdded'] = response;
			});
			if(numPrices === 2){
				getDate(daftDropResponseAttribs[11], function(response){
					details['dateUpdated'] = response;
				});
			}
			else if(numPrices > 2){
				getDate(daftDropResponseAttribs[5 + (6 * (numPrices -1))], function(response){
					details['dateUpdated'] = response;
				});
			}
			else{
				details['dateUpdated'] = 'Never';
			}
			callback(details);
		}
	}
	else{
		callback('Not Collected Yet');
	}
}

function getNumberOfPrices(daftDropResponseAttribs){
		for(var i = 0; i< daftDropResponseAttribs.length; i++){
		if (daftDropResponseAttribs[i].charAt(0) === '['){		// This starts at a different index for different number of prices. Goes up by 6 places for each price.
			return numPrices = (i - 23)/6;
		}
	}
}
function getCurrentPrice(daftDropResponseAttribs){
	var numPrices = 0;
	var currentPrice = 0;
	var numPrices = getNumberOfPrices(daftDropResponseAttribs);

	if(numPrices > 2){
		currentPrice = daftDropResponseAttribs[2 + (6 * (numPrices-1))];
	}
	else{
		currentPrice = daftDropResponseAttribs[8];
	}
	return currentPrice;
}
function getChangePercentageHtml(currentPrice, originalPrice, callback){
	var changeString = '';
	if (originalPrice > currentPrice && currentPrice > 9){		// currentPrice's length is greater than 1... not sure what the field actually corresponds to, if there's no 
		changeString = "-" + (((originalPrice - currentPrice)/originalPrice)*100).toFixed(2) + "%";
		document.getElementById('change-percentage-value').setAttribute('class', 'dropped');
	}
	else if(originalPrice < currentPrice){
		changeString = "+" + (((currentPrice - originalPrice)/currentPrice)*100).toFixed(2) + "%";
		document.getElementById('change-percentage-value').setAttribute('class', 'increased');
	}
	else{
		document.getElementById('change-percentage-value').setAttribute('class', 'noChange');
		changeString = "None";
	}
	callback(changeString);	
}
function numberWithCommas(x, callback) {
    callback(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}