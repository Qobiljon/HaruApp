export class Ht2Pg27Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };
	
	countUcInput45: number = 2;
	passUcInput45: number = 1;
	resultUcInput45: number = -1;
	isUcInput45: boolean = false;
	sceneUcInput45: number = 45;

	countUcInput46: number = 2;
	passUcInput46: number = 2;
	resultUcInput46: number = -1;
	isUcInput46: boolean = false;
	sceneUcInput46: number = 46;

	countUcInput47: number = 2;
	passUcInput47: number = 3;
	resultUcInput47: number = -1;
	isUcInput47: boolean = false;
	sceneUcInput47: number = 47;

	countUcFeelRating48: number = -1;
	isUcFeelRating48: boolean = false;
	sceneUcFeelRating48: number = 48;

	isUcInput52: boolean = false;
	sceneUcInput52: number = 52;

	countUcInput53: number = 2;
	passUcInput53: number = 5;
	resultUcInput53: number = -1;
	isUcInput53: boolean = false;
	sceneUcInput53: number = 53;

	countUcInput55: number = 2;
	passUcInput55: number = 4;
	resultUcInput55: number = -1;
	isUcInput55: boolean = false;
	sceneUcInput55: number = 55;

	countUcFeelRating56: number = -1;
	isUcFeelRating56: boolean = false;
	sceneUcFeelRating56: number = 56;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 1;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 64;

	countUcQuiz2: number = 2;
	passUcQuiz2: any = {1: 3, 2: 1, 3: 2};
	resultUcQuiz2: any = {1: -1, 2: -1, 3: -1};
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 65;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}