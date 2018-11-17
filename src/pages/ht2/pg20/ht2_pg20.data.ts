export class Ht2Pg20Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	countTodayFeelRating: number = -1;
	isTodayFeelRating:boolean = false;
	sceneTodayFeelRating: number = 6;

	sceneUcAudio8: number = 8;

	countUcFeelRating10: number = -1;
	isUcFeelRating10: boolean = false;
	sceneUcFeelRating10: number = 10;

	resultUcData11: number = -1;
	sceneUcData11: number = 11;

	textUcData13: any = {1:'근육 이완 동영상', 2:'근육 이완 오디오', 3:'동물 이완 오디오', 4:'장면 이완 오디오', 5:'근육 이완 동영상'};
	resultUcData13: number = -1;
	sceneUcData13: number = 13;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 1;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 17;

	countUcQuiz2: number = 2;
	passUcQuiz2: any = {1:1, 2:2};
	resultUcQuiz2: any = {1:-1, 2:-1};
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 18;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

    constructor(
    ) { }
}