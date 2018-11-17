export class Ht2Pg14Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };
	
	selectUcSleepTime42: number = -1;
	resultUcSleepTime42: any = { 1:{'ampm': '오전', 'hour': 0, 'min': 0}, 2:{'ampm': '오전', 'hour': 0, 'min': 0}, 3:{'ampm': '오전', 'hour': 0, 'min': 0}, 4:{'ampm': '오전', 'hour': 0, 'min': 0} };
	sceneUcSleepTime42: number = 42;

	sceneUcData43: number = 43;
	sceneUcData44: number = 44;
	sceneUcData45: number = 45;
	sceneUcData46: number = 46;

	resultUcSleepTime48: any = {'ampm': '오전', 'hour': 7, 'min': 0};
	isUcSleepTime48: boolean = false;
	sceneUcSleepTime48: number = 48;

	resultUcSleepTime49: any = {'hour': 8, 'min': 0};
	isUcSleepTime49: boolean = false;
	sceneUcSleepTime49: number = 49;

	resultUcSleepTime50: any = {'ampm': '오전', 'hour': 7, 'min': 0};
	sceneUcSleepTime50: number = 50;

	resultUcSleepTime51: any = { 1:{'ampm': '오전', 'hour': 0, 'min': 0}, 2:{'ampm': '오전', 'hour': 0, 'min': 0}, 3:{'ampm': '오전', 'hour': 0, 'min': 0} };
	sceneUcSleepTime51: number = 51;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 2;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 55;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 2;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 56;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }
}