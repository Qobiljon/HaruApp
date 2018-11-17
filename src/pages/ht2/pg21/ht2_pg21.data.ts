export class Ht2Pg21Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	countTodayFeelRating: number = -1;
	isTodayFeelRating:boolean = false;
	sceneTodayFeelRating: number = 7;
	
	sceneUcAudio12: number = 12;

	countUcFeelRating13: number = -1;
	isUcFeelRating13: boolean = false;
	sceneUcFeelRating13: number = 13;

	sceneUcAudio14: number = 14;

	countUcFeelRating15: number = -1;
	isUcFeelRating15: boolean = false;
	sceneUcFeelRating15: number = 15;

	sceneUcAudio16: number = 16;

	countUcFeelRating17: number = -1;
	isUcFeelRating17: boolean = false;
	sceneUcFeelRating17: number = 17;

	textUcInput20: any = {1:'근육 이완 간단버전', 2:'동물 이완 간단버전', 3:'장면 이완 간단버전'};
	resultUcInput20: number = -1;
	isUcInput20: boolean = false;
	sceneUcInput20: number = 20;

	countUcQuiz1: number = 2;
	passUcQuiz1: any = {1:true, 2:false, 3:false, 4:true};
	resultUcQuiz1: any = {1:false, 2:false, 3:false, 4:false};
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 24;

	countUcQuiz2: number = 2;
	passUcQuiz2: any = {1:1, 2:2};
	resultUcQuiz2: any = {1:-1, 2:-1};
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 25;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

    constructor(
    ) { }
}