"use strict";


let vm = {
	paused: false,
	procAddress: 0,
	script: 0,
	INTFile: 0,

	dataStack: [],
	retStack: [],

	op(op = null) {
		return {
			0xC001: () => {
				//this.push(this.script.read32())
				console.log("0xC001");
			},
			0x800D: () => {
				//this.retStack.push(this.pop())
			},
			0x800C: () => {
				//this.push(this.popAddr()) 	 // op_a_to_d
			},
			0x801A: () => {		// op_pop
				this.pop();
			},
			0x8004:() => {		// op_jmp
				//this.pc = this.pop()
			}
		}[op] || null;
	},

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
