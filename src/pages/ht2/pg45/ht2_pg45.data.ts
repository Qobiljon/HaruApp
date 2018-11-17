export class Ht2Pg45Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };
	
	countUcInput15: number = 2;
	resultUcInput15: any = {1:false, 2:false, 3:false, 4:false};
	passUcInput15: any = {1:true, 2:false, 3:true, 4:false};
	isUcInput15: boolean = false;
	sceneUcInput15: number = 15;

	countUcInput18: number = 2;
	resultUcInput18: any = {1:false, 2:false, 3:false, 4:false};
	passUcInput18: any = {1:true, 2:false, 3:false, 4:true};
	isUcInput18: boolean = false;
	sceneUcInput18: number = 18;

	countUcInput21: number = 2;
	resultUcInput21: any = {1:false, 2:false, 3:false, 4:false};
	passUcInput21: any = {1:true, 2:true, 3:false, 4:false};
	isUcInput21: boolean = false;
	sceneUcInput21: number = 21;

	countUcInput24: number = 2;
	resultUcInput24: any = {1:false, 2:false, 3:false, 4:false};
	passUcInput24: any = {1:false, 2:true, 3:false, 4:true};
	isUcInput24: boolean = false;
	sceneUcInput24: number = 24;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 34;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 3;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 35;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}