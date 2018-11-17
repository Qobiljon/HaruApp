export class Ht1Pg14Data {

	textUcInput16: any = {1:'스트레스', 2:'통증', 3:'불면', 4:'과민성 대장증후군', 5:'우울', 6:'불안'};
	countUcInput16: number = 2;
	passUcInput16: any = {1:true, 2:true, 3:true, 4:true, 5:true, 6:true};
	resultUcInput16: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false};
	isUcInput16: boolean = false;
	sceneUcInput16: number = 16;

	isUcAlarm25: boolean = false;
	sceneUcAlarm25: number = 25;	
	resultUcAlarm25: any = {'ampm': '오전', 'hour': 7, 'min': 0};

	textUcInput26: any = {1:'집', 2:'병원', 3:'직장', 4:'기타'};
	resultUcInput26: number = -1;
	isUcInput26: boolean = false;
	sceneUcInput26: number = 26;

	textUcInput27: any = {1:'운동복', 2:'잠옷', 3:'환복', 4:'기타'};
	resultUcInput27: number = -1;
	isUcInput27: boolean = false;
	sceneUcInput27: number = 27;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 31;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 5;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 32;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }
}