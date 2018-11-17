export class Ht2Pg15Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	selectUcSleepTime36: number = -1;
	resultUcSleepTime36: any = {'ampm': '오전', 'hour': 0, 'min': 0 };
	passUcSleepTime36: any = {'ampm': '오전', 'hour': 3, 'min': 15 };
	isUcSleepTime36: boolean = false;
	sceneUcSleepTime36: number = 36;

	sceneUcData37: number = 37;
	sceneUcData38: number = 38;
	sceneUcData39: number = 39;

	selectUcSleepTime45: number = -1;
	resultUcSleepTime45: any = {'ampm': '오전', 'hour': 0, 'min': 0 };
	passUcSleepTime45: any = {'ampm': '오전', 'hour': 12, 'min': 0 };
	isUcSleepTime45: boolean = false;
	sceneUcSleepTime45: number = 45;

	sceneUcData46: number = 46;
	sceneUcData47: number = 47;
	sceneUcData48: number = 48;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }
}