//var frames = document.getElementsByTagName("iframe");
//for (var i = 0; i < frames.length; i++) {
//	frames[i].style.display="none";
//}

function getStackTrace() {
  var obj = {};
  Error.captureStackTrace(obj, getStackTrace);
  return obj.stack;
}

function domEvent(e) {
	//var trace = getStackTrace();
	console.trace();
	console.log(e.target);
	//console.log(trace);
	$(e.target).css("border", "5px solid red");
}

document.addEventListener('DOMNodeInserted', domEvent);

