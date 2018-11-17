export class Ht2Pg41Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	textUcInput1:any = {1:'회사에 사정을 이야기하고 근무시간을 조정한다.', 2:'직장에 복귀하는 것을 미룬다.', 3:'아르바이트를 구한다.'};
	textUcInput2:any = {1:'시간이 많이 들지 않는다.', 2:'몸에 무리가 가지 않는다.', 3:'당분간 푹 쉴 수 있다.', 4:'더 좋은 기회가 될 수 있다.', 5:'상대적으로 쉽다.', 6:'새로 적응할 필요가 없다.',
						7:'회사가 협의해주지 않을 수 있다.', 8:'수입이 없다.', 9:'수입이 줄어든다.', 10:'새로운 일을 배워야 한다.', 11:'몸에 무리가 갈 수 있다.', 12:'일을 구하기 어려울 수 있다.'};

	resultUcInput16: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false};
	isUcInput16: boolean = false;
	sceneUcInput16: number = 16;

	resultUcInput17: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false};
	isUcInput17: boolean = false;
	sceneUcInput17: number = 17;

	resultUcInput18: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false};
	isUcInput18: boolean = false;
	sceneUcInput18: number = 18;

	resultUcInput19: number = -1;
	isUcInput19: boolean = false;
	sceneUcInput19: number = 19;

	sceneUcData20: number = 20;
	sceneUcData21: number = 21;
	sceneUcData22: number = 22;

	sceneUcData23: number = 23;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 1;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 29;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 4;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 30;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}