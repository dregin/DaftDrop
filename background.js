chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    //sendRequest(request);
    var homeId = request;
    var request = new XMLHttpRequest();
    var data = "7|0|5|http://www.daftdrop.com/daftdrop/|97860B781FF21C876CA7FA46D7F5BB9D|com.daftdrop.client.HouseService|getPriceDrops|java.lang.Integer/3438268394|1|2|3|4|1|5|5|" + homeId + "|";
    var tempData = array(data.toString());
    data = tempData;
    if (request == null){
            console.log("Unable to create request");
        }
    else{
        var url = "http://www.daftdrop.com/daftdrop/house";

        request.onreadystatechange = function(){
            if(request.readyState == 4){
                sendResponse(request.responseText);
            }
        }
        request.open("POST", url, true);
        request.setRequestHeader("X-GWT-Permutation", "60773B167848CE8C3B7F587B66D9523E");
        request.setRequestHeader("Content-Type", "text/x-gwt-rpc; charset=UTF-8");
        request.send(data);
    }
    return true;
});

array = function () { // JSON fix
        var a = window.Array.apply(window, arguments);
        a.toJSON = undefined;
        return a;
    }