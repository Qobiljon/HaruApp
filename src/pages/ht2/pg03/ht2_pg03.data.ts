export class Ht2Pg03Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	textUcInput1: any = { 1:'잠드는 데 어려움이 있는 유형', 2:'중간에 자주 깨는 유형', 3:'너무 일찍 깨는 유형' };
	textUcInput2: any = { 1:'감정', 2:'생각', 3:'신체적 요인', 4:'생활 습관', 5:'기타' };

	resultUcInput14: number = -1;
	isUcInput14: boolean = false;
	sceneUcInput14: number = 14;

	resultUcInput53: any = {1:false, 2:false, 3:false, 4:false, 5:false};
	isUcInput53: boolean = false;
	sceneUcInput53: number = 53;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 5;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 59;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 3;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 60;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}