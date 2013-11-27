
var Log = {
		//index: window.localStorage.getItem("DOMMutationLogger:index"),
		//$event_log: document.getElementById("event-log"),

		init: function() {
			this.index=0;
		},

		storeAdd: function storeAdd(entry) {
			console.log("entered");
			entry.id = Log.index;
			//window.localStorage.setItem("DOMMutationLogger:index", ++DOMMutationLogger.index);
			//window.localStorage.setItem("DOMMutationLogger:"+ entry.id, JSON.stringify(entry));
		},
		
		storeRemove: function(entry) {
			//window.localStorage.removeItem("DOMMutationLogger:"+ entry.id);
		},
};
Log.init();

function getLine(){ 
	try { 
		throw Error('');
	} 
	catch(err) {
		var caller_line = err.stack.split("\n")[4]; 
		var index = caller_line.indexOf("at "); 
		var line = caller_line.slice(index+2, caller_line.length);
		console.log("line: "+line);
		//console.log(err);
		return line; 
		}
}
