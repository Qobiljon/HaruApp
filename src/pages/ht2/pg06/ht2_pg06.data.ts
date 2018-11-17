export class Ht2Pg06Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	textUcInput: any = {1:'몸이 안 좋아. 낮잠을 자야 해.', 2:'오늘 밤에 보충하자.', 3:'인생이 너무 힘들다.', 4:'다음부터 미리 일 해야지.', 5:'오늘은 아무것도 하지 말고 쉬자.'};

	resultUcInput38: number = -1;
	selectUcInput38: number = -1;
	isUcInput38: boolean = false;
	sceneUcInput38: number = 38;

	sceneUcData39: number = 39;
	sceneUcData40: number = 40;
	sceneUcData41: number = 41;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 46;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 5;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 47;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}