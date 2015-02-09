//var frames = document.getElementsByTagName("iframe");
//for (var i = 0; i < frames.length; i++) {
//	frames[i].style.display="none";
//}

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
    console.log(e.data);
    $('#' + e.data.id).css('border', '5px red solid');
});

/*window.addEventListener('ReportChange', function(e) {
    console.log(e);
});*/

//Inject code
var script = document.createElement('script');
script.textContent = '(' + catchDOMChanges + '())';
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);