export class Ht2Pg48Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };
	
	textUcInput1: any = {1:'실천', 2:'파악', 3:'대안'};
	textUcInput2: any = {1:'객관적', 2:'구체적', 3:'나'};

	countUcInput13: number = 2;
	resultUcInput13: any = {1:-1, 2:-1, 3:-1};
	passUcInput13: any = {1:2, 2:3, 3:1};
	isUcInput13: boolean = false;
	sceneUcInput13: number = 13;

	countUcInput30: number = 2;
	resultUcInput30: any = {1:-1, 2:-1, 3:-1};
	passUcInput30: any = {1:3, 2:1, 3:2};
	isUcInput30: boolean = false;
	sceneUcInput30: number = 30;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}