export class Ht3Pg03Data {

	resultTodayAcheBody: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false, 13:false, 14:false};
	countTodayAcheBody: number = 0;
	selectTodayAcheBody: any = {1: -1, 2: -1, 3: -1};
	isTodayAcheBody: boolean = false;
	sceneTodayAcheBody: number = 1;

	textUcInput:any = {1:'음악치료', 2:'인지행동치료', 3:'이완훈련', 4:'미술치료', 5:'물리치료', 6:'정신분석치료', 7:'마사지', 8:'최면'};
	countUcInput29: number = 2;
	resultUcInput29: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false};
	passUcInput29: any = {1:false, 2:true, 3:true, 4:false, 5:true, 6:false, 7:true, 8:true};
	isUcInput29: boolean = false;
	sceneUcInput29: number = 29

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 2;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 40;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 1;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 41;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}