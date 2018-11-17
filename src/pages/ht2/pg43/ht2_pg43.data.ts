export class Ht2Pg43Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };
	
	textUcInput1: any = {1:'마음 속으로 1부터 10까지 숫자 세기', 2:'일단 그 자리를 피하기', 3:'심호흡 하기'};
	textUcInput2: any = {1:'손녀가 미웠다', 2:'딸이 자주 손녀를 부탁했다', 3:'깨진 접시가 아끼던 것이었다', 4:'계속 집에만 있어 우울했다', 5:'딸 부부에게 서운한 것이 있었다'};
	textUcInput3: any = {1:'도움 요청하기', 2:'입장 바꿔보기', 3:'대안 마련하기'};
	textUcInput4: any = {1:'감정 표현하기', 2:'취미 생활하기', 3:'이완훈련'};

	resultUcInput18: number = -1;
	isUcInput18: boolean = false;
	sceneUcInput18: number = 18;

	resultUcInput20: any = {1:false, 2:false, 3:false, 4:false, 5:false};
	isUcInput20: boolean = false;
	sceneUcInput20: number = 20;

	resultUcInput24: any = {1:-1, 2:-1, 3:-1, 4:-1, 5:-1};
	isUcInput24: boolean = false;
	sceneUcInput24: number = 24;

	resultUcInput28: number = -1;
	isUcInput28: boolean = false;
	sceneUcInput28: number = 28;

	resultUcInput29: number = -1;
	isUcInput29: boolean = false;
	sceneUcInput29: number = 29;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 4;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 34;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 1;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 35;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}