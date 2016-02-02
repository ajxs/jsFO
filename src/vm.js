"use strict";

function ScriptVM() {

};

ScriptVM.prototype = {
	constructor: ScriptVM,
	paused: false,
	procAddress: 0,
	script: 0,
	INTFile: 0,
	
	dataStack: [],
	retStack: [],
	
	loadScript(script, INTFile) {
		this.script = script;
		this.INTFile = INTFile;
	},
	
	push: function(val) {
		this.dataStack.push(val);
	},
	
	pop: function() {
		if(this.dataStack.length === 0) {
			return this.dataStack.pop();
		} else {
			console.log("ScriptVM: pop: stack underflow");
			return null;
		}
	},
	
	call: function(procName, args) {		
		var proc = this.INTFile.procedures[procName]
		// console.log("CALL " + procName + " @ " + proc.offset + " from " + this.scriptObj.scriptName)
		if(!proc) {
			
		}
	},
	
	step: function() {
		if(this.paused) return false;
		
		var procAddress = this.procAddress;
		var opCode = this.INTFile.body[procAddress];
	},
	
	run: function() {
		this.paused = false;
		while(this.step());
	}
	
};
