//var frames = document.getElementsByTagName("iframe");
//for (var i = 0; i < frames.length; i++) {
//	frames[i].style.display="none";
//}

var collection = {};

// This code will be injected to run in webpage context
function catchDOMChanges() {
    var counter = 1;
    document.addEventListener('DOMNodeInserted', function(e) {
        //give the node an ID but ONLY if it doesn't have one already
        e.target.id = (e.target.id || "extension_marker_id_" + counter++);
        var i = {
            stack: (new Error().stack),
            id: e.target.id
        };
        //window.dispatchEvent(new CustomEvent('ReportChange', i));
        window.postMessage(i, '*');
    });
}

//we just got an event
window.addEventListener('message', function(e) {
    //need to parse stack trace and do something with it
    //console.log(e.data);
    var uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?������]))/ig;
    var urls = e.data.stack.match(uri_pattern);
    
    if (urls) {
		for (var i = 0; i < urls.length; i++) {
			var dom = getDomain(urls[i]);
			if (pdom != dom) {
				//send message to extension script that has element ID and domain
				//console.log("External: " + e.data.id + "  " + dom);
				//$('#' + e.data.id).css('border', '5px red solid');
				collection[dom] ? collection[dom].push(e.data.id) : collection[dom] = [e.data.id];
				console.log(collection);
				break;
			}
		}
	}
    //$('#' + e.data.id).css('border', '5px red solid');
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("got a message");
	if (request.type == "all") {
      	sendResponse(collection);
    }
});

//get the page domain
var pdom = window.location.hostname;

function getDomain(url) {
	var matches = url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
	return matches && matches[1];
}

/*window.addEventListener('ReportChange', function(e) {
    console.log(e);
});*/

//Inject code
var script = document.createElement('script');
script.textContent = '(' + catchDOMChanges + '())';
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);