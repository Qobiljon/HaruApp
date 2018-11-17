export class Ht2Pg32Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	countUcFeelRating17: number = -1;
	isUcFeelRating17: boolean = false;
	sceneUcFeelRating17: number = 17;

	countUcInput21: number = -1;
	isUcInput21: boolean = false;
	sceneUcInput21: number = 21;

	countUcInput24: number = 2;
	passUcInput24: any = {1:true, 2: false, 3:true, 4:true};
	resultUcInput24: any = {1:false, 2: false, 3:false, 4:false};
	isUcInput24: boolean = false;
	sceneUcInput24: number = 24;

	countUcInput28: number = 2;
	passUcInput28: number = 4;
	resultUcInput28: number = -1;
	isUcInput28: boolean = false;
	sceneUcInput28: number = 28;

	countUcFeelRating29: number = -1;
	isUcFeelRating29: boolean = false;
	sceneUcFeelRating29: number = 29;

	countUcInput33: number = -1;
	isUcInput33: boolean = false;
	sceneUcInput33: number = 33;

	selectUcData34: number = -1;
	sceneUcData34: number = 34;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 4;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 37;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 1;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 38;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}