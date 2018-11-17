export class Ht2Pg36Data {

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

	textUcInput24: any = {1:'식습관 관리', 2:'적당한 운동', 3:'금주', 4:'금연', 5: '수면일과'}
	orderUcInput24: any = {1: -1, 2: -1, 3: -1, 4: -1, 5: 5};
	resultUcInput24: any = {1: -1, 2: -1, 3: -1, 4: -1, 5: 5};
	isUcInput24: boolean = false;
	sceneUcInput24: number = 24;

 	maxUcInput25: number = 100;
	sumUcInput25: number = 0;
	resultUcInput25: any = {1:0, 2:0, 3:0, 4:0, 5:0};
	isUcInput25: boolean = false;
	sceneUcInput25: number = 25;

	sceneUcData27: number = 27;
	sceneUcData28: number = 28;
	sceneUcData29: number = 29;
	sceneUcData30: number = 30;
	sceneUcData31: number = 31;
	sceneUcData32: number = 32;

	countUcInput33: number = 2;
	passUcInput33: number = 1;
	resultUcInput33: number = -1;
	isUcInput33: boolean = false;
	sceneUcInput33: number = 33;

	countUcInput36: number = 2;
	passUcInput36: number = 4;
	resultUcInput36: number = -1;
	isUcInput36: boolean = false;
	sceneUcInput36: number = 36;

	countUcFeelRating37: number = -1;
	isUcFeelRating37: boolean = false;
	sceneUcFeelRating37: number = 37;

	countUcInput41: number = -1;
	isUcInput41: boolean = false;
	sceneUcInput41: number = 41;

	selectUcData42: number = -1;
	sceneUcData42: number = 42;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 2;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 45;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 2;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 46;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}