export class Ht2Pg26Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };
	
	countUcInput10: number = 2;
	passUcInput10: any = {1:2, 2:1};
	resultUcInput10: any = {1:-1, 2:-1};
	isUcInput10: boolean = false;
	sceneUcInput10: number = 10;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}