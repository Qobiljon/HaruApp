export class Ht2Pg04Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	resultUcInput22: number = -1;
	isUcInput22: boolean = false;
	sceneUcInput22: number = 22;

	sceneUcData23: number = 23;
	sceneUcData24: number = 24;
	sceneUcData25: number = 25;
	sceneUcData26: number = 26;
	sceneUcData30: number = 30;
	sceneUcData31: number = 31;
	sceneUcData34: number = 34;
	sceneUcData35: number = 35;
	sceneUcData37: number = 37;
	sceneUcData38: number = 38;

	countUcQuiz1: number = 2;
	passUcQuiz1: any = {1:true, 2:false, 3:false, 4:true};
	resultUcQuiz1: any = {1:false, 2:false, 3:false, 4:false};
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 41;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 3;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 42;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}