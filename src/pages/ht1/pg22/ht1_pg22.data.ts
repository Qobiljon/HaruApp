export class Ht1Pg22Data {

	textUcInput4: any = {1:'검사 결과를 들을 때', 2:'항암 치료를 받을 때', 3:'직장에서 발표를 할 때', 4:'불편한 사람과 만날 때'};
	textSelectUcInput4: any = {
			1: {1:'집에서 검사 결과에 대한 상상을 할 때', 2:'병원으로 가는 길', 3:'병원에 도착하여 접수를 할 때', 4:'대기실에서 대기할 때', 5:'의사선생님에게 검사결과를 들을 때'},
			2: {1:'병원에 가는 길', 2:'병원에 도착하여 로비에 들어가기', 3:'치료 접수를 하고 대기실에서 기다리기', 4:'이름이 불리고 치료실에 들어가기', 5:'항암치료실 침대에 누워있기'},
			3: {1:'전날 집에서 발표에 대해 생각할 때', 2:'발표 당일 집에서 회사 갈 준비를 할 때', 3:'회사에 도착하여 발표 준비를 할 때', 4:'발표 순서를 기다릴 때', 5:'발표를 시작할 때'},
			4: {1:'전날 집에서 싫어하는 사람과 만나는 생각을 할 때', 2:'그 다음날 외출 준비를 할 때', 3:'불편한 사람을 만나러 가는 길', 4:'불편한 사람을 약속장소에서 기다릴 때', 5:'불편한 사람과 대면할 때'}
	};
	resultUcInput4: number = -1;
	isUcInput4: boolean = false;
	sceneUcInput4: number = 4;

	orderUcInput6: any = {
		1: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		2: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		3: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		4: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1}
	};
	resultUcInput6: any = {
		1: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		2: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		3: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		4: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1}
	};
	stepUcInput6: any = {1:1, 2:1, 3:1, 4:1};
	isUcInput6: boolean = false;
	sceneUcInput6: number = 6;

	textUcRating: any = {0:'0점', 1:'1점', 2:'2점', 3:'3점', 4:'4점', 5:'5점', 6:'6점', 7:'7점', 8:'8점', 9:'9점', 10:'10점'}

	countUcUnrestRating9: number = 0;
	isUcUnrestRating9: boolean = false;
	sceneUcUnrestRating9: number = 9;

	textUcInput11: any = {1:'근육 이완', 2:'동물 이완', 3:'장면 이완'};
	resultUcInput11: number = -1;
	isUcInput11: boolean = false;
	sceneUcInput11: number = 11;

	sceneUcAudio12: number = 12;

	countUcUnrestRating13: number = 0;
	isUcUnrestRating13: boolean = false;
	sceneUcUnrestRating13: number = 13;

	countUcUnrestRating16: number = 0;
	isUcUnrestRating16: boolean = false;
	sceneUcUnrestRating16: number = 16;

	countUcUnrestRating18: number = 0;
	isUcUnrestRating18: boolean = false;
	sceneUcUnrestRating18: number = 18;

	countUcUnrestRating21: number = 0;
	isUcUnrestRating21: boolean = false;
	sceneUcUnrestRating21: number = 21;

	countUcUnrestRating23: number = 0;
	isUcUnrestRating23: boolean = false;
	sceneUcUnrestRating23: number = 23;

	countUcUnrestRating26: number = 0;
	isUcUnrestRating26: boolean = false;
	sceneUcUnrestRating26: number = 26;

	countUcUnrestRating28: number = 0;
	isUcUnrestRating28: boolean = false;
	sceneUcUnrestRating28: number = 28;

	countUcUnrestRating31: number = 0;
	isUcUnrestRating31: boolean = false;
	sceneUcUnrestRating31: number = 31;

	countUcUnrestRating33: number = 0;
	isUcUnrestRating33: boolean = false;
	sceneUcUnrestRating33: number = 33;

	countUcQuiz1: number = 2;
	passUcQuiz1: any = {1:3, 2:1, 3:2};
	resultUcQuiz1: any = {1:-1, 2:-1, 3:-1};
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 40;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 1;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 41;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}