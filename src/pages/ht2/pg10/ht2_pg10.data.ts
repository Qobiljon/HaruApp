export class Ht2Pg10Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	countUcInput16: number = 2;
	passUcInput16: any = {1:true, 2:true, 3:true, 4:true};
	resultUcInput16: any = {1:false, 2:false, 3:false, 4:false};
	isUcInput16: boolean = false;
	sceneUcInput16: number = 16;

	selectUcInput49: number = -1;
	resultUcInput49: any = {1:false, 2:false, 3:false, 4:false, 5:false};
	isUcInput49: boolean = false;
	sceneUcInput49: number = 49;

	sceneUcData50: number = 50;
	sceneUcData51: number = 51;
	sceneUcData52: number = 52;
	
	countUcQuiz1: number = 2;
	passUcQuiz1: number = 2;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 54;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 1;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 55;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}