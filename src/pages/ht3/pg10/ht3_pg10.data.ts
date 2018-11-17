export class Ht3Pg10Data {

	resultTodayAcheBody: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false, 13:false, 14:false};
	countTodayAcheBody: number = 0;
	selectTodayAcheBody: any = {1: -1, 2: -1, 3: -1};
	isTodayAcheBody: boolean = false;
	sceneTodayAcheBody: number = 1;

	countTodayFeelRating: number = -1;
	isTodayFeelRating:boolean = false;
	sceneTodayFeelRating: number = 4;

	sceneUcAudio8: number = 8;

	countUcFeelRating10: number = -1;
	isUcFeelRating10: boolean = false;
	sceneUcFeelRating10: number = 10;

	resultUcData11: number = -1;
	sceneUcData11: number = 11;

	textUcData13: any = {1:'근육 이완 동영상', 2:'근육 이완 오디오', 3:'근육 이완 동영상'};
	resultUcData13: number = -1;
	sceneUcData13: number = 13;

	countUcQuiz1: number = 2;
	passUcQuiz1: any = {1:true, 2:false, 3:false, 4:true};
	resultUcQuiz1: any = {1:false, 2:false, 3:false, 4:false};
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 17;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 2;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 18;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}