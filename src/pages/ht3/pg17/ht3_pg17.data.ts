export class Ht3Pg17Data {

	resultTodayAcheBody: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false, 13:false, 14:false};
	countTodayAcheBody: number = 0;
	selectTodayAcheBody: any = {1: -1, 2: -1, 3: -1};
	isTodayAcheBody: boolean = false;
	sceneTodayAcheBody: number = 1;

	textUcInput5: any = {1:'검사 결과를 들을 때', 2:'항암 치료를 받을 때', 3:'직장에서 발표를 할 때', 4:'불편한 사람과 만날 때'};
	textSelectUcInput5: any = {
			1: {1:'집에서 검사 결과에 대한 상상을 할 때', 2:'병원으로 가는 길', 3:'병원에 도착하여 접수를 할 때', 4:'대기실에서 대기할 때', 5:'의사선생님에게 검사결과를 들을 때'},
			2: {1:'병원에 가는 길', 2:'병원에 도착하여 로비에 들어가기', 3:'치료 접수를 하고 대기실에서 기다리기', 4:'이름이 불리고 치료실에 들어가기', 5:'항암치료실 침대에 누워있기'},
			3: {1:'전날 집에서 발표에 대해 생각할 때', 2:'발표 당일 집에서 회사 갈 준비를 할 때', 3:'회사에 도착하여 발표 준비를 할 때', 4:'발표 순서를 기다릴 때', 5:'발표를 시작할 때'},
			4: {1:'전날 집에서 싫어하는 사람과 만나는 생각을 할 때', 2:'그 다음날 외출 준비를 할 때', 3:'불편한 사람을 만나러 가는 길', 4:'불편한 사람을 약속장소에서 기다릴 때', 5:'불편한 사람과 대면할 때'}
	};
	resultUcInput5: number = -1;
	isUcInput5: boolean = false;
	sceneUcInput5: number = 5;

	orderUcInput7: any = {
		1: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		2: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		3: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		4: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1}
	};
	resultUcInput7: any = {
		1: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		2: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		3: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1},
		4: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1}
	};
	stepUcInput7: any = {1:1, 2:1, 3:1, 4:1};
	isUcInput7: boolean = false;
	sceneUcInput7: number = 7;

	textUcRating: any = {0:'0점', 1:'1점', 2:'2점', 3:'3점', 4:'4점', 5:'5점', 6:'6점', 7:'7점', 8:'8점', 9:'9점', 10:'10점'}

	countUcUnrestRating10: number = 0;
	isUcUnrestRating10: boolean = false;
	sceneUcUnrestRating10: number = 10;

	textUcInput12: any = {1:'근육 이완', 2:'동물 이완', 3:'장면 이완'};
	resultUcInput12: number = -1;
	isUcInput12: boolean = false;
	sceneUcInput12: number = 12;

	sceneUcAudio13: number = 13;

	countUcUnrestRating14: number = 0;
	isUcUnrestRating14: boolean = false;
	sceneUcUnrestRating14: number = 14;

	countUcUnrestRating17: number = 0;
	isUcUnrestRating17: boolean = false;
	sceneUcUnrestRating17: number = 17;

	countUcUnrestRating19: number = 0;
	isUcUnrestRating19: boolean = false;
	sceneUcUnrestRating19: number = 19;

	countUcUnrestRating22: number = 0;
	isUcUnrestRating22: boolean = false;
	sceneUcUnrestRating22: number = 22;

	countUcUnrestRating24: number = 0;
	isUcUnrestRating24: boolean = false;
	sceneUcUnrestRating24: number = 24;

	countUcUnrestRating27: number = 0;
	isUcUnrestRating27: boolean = false;
	sceneUcUnrestRating27: number = 27;

	countUcUnrestRating29: number = 0;
	isUcUnrestRating29: boolean = false;
	sceneUcUnrestRating29: number = 29;

	countUcUnrestRating32: number = 0;
	isUcUnrestRating32: boolean = false;
	sceneUcUnrestRating32: number = 32;

	countUcUnrestRating34: number = 0;
	isUcUnrestRating34: boolean = false;
	sceneUcUnrestRating34: number = 34;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: any = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 41;

	countUcQuiz2: number = 2;
	passUcQuiz2: any = {1:1, 2:2};
	resultUcQuiz2: any = {1:-1, 2:-1};
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 42;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}