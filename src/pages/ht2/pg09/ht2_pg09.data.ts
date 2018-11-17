export class Ht2Pg09Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	selectUcInput18: number = -1;
	passUcInput18: any = {1:true, 2:false, 3:true, 4:true, 5:false};
	resultUcInput18: any = {1:false, 2:false, 3:false, 4:false, 5:false};
	isUcInput18: boolean = false;
	sceneUcInput18: number = 18;

	sceneUcData19: number = 19;
	sceneUcData20: number = 20;
	sceneUcData21: number = 21;

	selectUcInput34: number = -1;
	passUcInput34: any = {1:false, 2:true, 3:false, 4:false, 5:true};
	resultUcInput34: any = {1:false, 2:false, 3:false, 4:false, 5:false};
	isUcInput34: boolean = false;
	sceneUcInput34: number = 34;

	sceneUcData35: number = 35;
	sceneUcData36: number = 36;
	sceneUcData37: number = 37;

	textUcInput46: any = {1:'카페인 조절', 2:'금연', 3:'알코올 조절', 4:'규칙적인 식습관', 5:'운동', 6:'온도조절', 7:'소음 차단', 8:'빛 차단'};
	resultUcInput46: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false};
	isUcInput46: boolean = false;
	sceneUcInput46: number = 46;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 49;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 2;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 50;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}