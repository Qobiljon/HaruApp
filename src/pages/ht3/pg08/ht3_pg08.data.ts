export class Ht3Pg08Data {

	resultTodayAcheBody: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false, 13:false, 14:false};
	countTodayAcheBody: number = 0;
	selectTodayAcheBody: any = {1: -1, 2: -1, 3: -1};
	isTodayAcheBody: boolean = false;
	sceneTodayAcheBody: number = 1;

	textUcInput17: any = {1:'스트레스', 2:'통증', 3:'불면', 4:'과민성 대장증후군', 5:'우울', 6:'불안'};
	countUcInput17: number = 2;
	passUcInput17: any = {1:true, 2:true, 3:true, 4:true, 5:true, 6:true};
	resultUcInput17: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false};
	isUcInput17: boolean = false;
	sceneUcInput17: number = 17;

	isUcAlarm26: boolean = false;
	sceneUcAlarm26: number = 26;	
	resultUcAlarm26: any = {'ampm': '오전', 'hour': 7, 'min': 0};

	textUcInput27: any = {1:'집', 2:'병원', 3:'직장', 4:'기타'};
	resultUcInput27: number = -1;
	isUcInput27: boolean = false;
	sceneUcInput27: number = 27;

	textUcInput28: any = {1:'운동복', 2:'잠옷', 3:'환복', 4:'기타'};
	resultUcInput28: number = -1;
	isUcInput28: boolean = false;
	sceneUcInput28: number = 28;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 32;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 5;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 33;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}