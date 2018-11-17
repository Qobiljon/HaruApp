export class Ht2Pg34Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };
	
	countUcFeelRating16: number = -1;
	isUcFeelRating16: boolean = false;
	sceneUcFeelRating16: number = 16;

	countUcInput20: number = -1;
	isUcInput20: boolean = false;
	sceneUcInput20: number = 20;

	countUcInput23: number = 2;
	passUcInput23: any = {1:true, 2: true, 3:true, 4:false};
	resultUcInput23: any = {1:false, 2: false, 3:false, 4:false};
	isUcInput23: boolean = false;
	sceneUcInput23: number = 23;

	countUcInput39: number = 2;
	passUcInput39: number = 4;
	resultUcInput39: number = -1;
	isUcInput39: boolean = false;
	sceneUcInput39: number = 39;

	countUcFeelRating40: number = -1;
	isUcFeelRating40: boolean = false;
	sceneUcFeelRating40: number = 40;

	countUcInput44: number = -1;
	isUcInput44: boolean = false;
	sceneUcInput44: number = 44;

	selectUcData45: number = -1;
	sceneUcData45: number = 45;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 1;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 49;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 2;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 50;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}