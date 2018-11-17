export class Ht2Pg19Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	countTodayFeelRating: number = -1;
	isTodayFeelRating:boolean = false;
	sceneTodayFeelRating: number = 7;
	
	sceneUcAudio10: number = 10;

	countUcFeelRating12: number = -1;
	isUcFeelRating12: boolean = false;
	sceneUcFeelRating12: number = 12;

	resultUcData13: number = -1;
	sceneUcData13: number = 13;

	textUcData15: any = {1:'근육 이완 동영상', 2:'근육 이완 오디오', 3:'동물 이완 오디오', 4:'근육 이완 동영상'};
	resultUcData15: number = -1;
	sceneUcData15: number = 15;

	countUcQuiz1: number = 2;
	passUcQuiz1: any = {1:2, 2:1};
	resultUcQuiz1: any = {1:-1, 2:-1};
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 19;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 4;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 20;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

    constructor(
    ) { }
}