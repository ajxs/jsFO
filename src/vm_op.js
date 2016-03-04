"use strict";

function vm_op(op = null) {
	return {
		0xC001: () => {
			//this.push(this.script.read32())
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
};
