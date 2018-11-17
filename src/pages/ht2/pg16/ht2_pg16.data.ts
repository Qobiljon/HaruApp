export class Ht2Pg16Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	textUcInput19: any = {1:'스트레스', 2:'통증', 3:'불면', 4:'과민성 대장증후군', 5:'우울', 6:'불안'};
	countUcInput19: number = 2;
	passUcInput19: any = {1:true, 2:true, 3:true, 4:true, 5:true, 6:true};
	resultUcInput19: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false};
	isUcInput19: boolean = false;
	sceneUcInput19: number = 19;

	isUcAlarm28: boolean = false;
	sceneUcAlarm28: number = 28;	
	resultUcAlarm28: any = {'ampm': '오전', 'hour': 7, 'min': 0};

	textUcInput29: any = {1:'집', 2:'병원', 3:'직장', 4:'기타'};
	resultUcInput29: number = -1;
	isUcInput29: boolean = false;
	sceneUcInput29: number = 29;

	textUcInput30: any = {1:'운동복', 2:'잠옷', 3:'환복', 4:'기타'};
	resultUcInput30: number = -1;
	isUcInput30: boolean = false;
	sceneUcInput30: number = 30;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 34;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 5;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 35;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

    constructor(
    ) { }
}