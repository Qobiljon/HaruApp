export class Ht2Pg39Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };
	
	textUcInput1:any = {
		1:'주치의를 바꾼다.', 2:'주치의에게 화를 낸다.', 3:'친구에게 하소연을 한다.',
		4:'질문을 적어 가서 보여준다.', 5:'인터넷에서 답을 찾고, 주치의에게 확인한다.', 6:'주치의가 답해줄 때까지 물어본다.'
	};
	textUcInput2:any = {1:'내가 할 수 있을 것 같아서', 2:'효과적일 것 같아서', 3:'준비가 쉬워서', 4:'계속해서 할 수 있을 것 같아서'};

	resultUcInput28: number = -1;
	isUcInput28: boolean = false;
	sceneUcInput28: number = 28;

	resultUcInput29: any = {1:false, 2:false, 3:false, 4:false};
	isUcInput29: boolean = false;
	sceneUcInput29: number = 29;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 2;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 46;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 3;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 47;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}