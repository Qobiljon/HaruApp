export class Ht2Pg17Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	countTodayFeelRating: number = -1;
	isTodayFeelRating:boolean = false;
	sceneTodayFeelRating: number = 6;

	countUcFeelRating12: number = -1;
	isUcFeelRating12: boolean = false;
	sceneUcFeelRating12: number = 12;

	resultUcData13: number = -1;
	sceneUcData13: number = 13;
	
	sceneUcData14: number = 14;
	sceneUcData15: number = 15;
	sceneUcData16: number = 16;
	sceneUcData17: number = 17;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 5;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 21;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 2;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 22;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

    constructor(
    ) { }
}