export class Ht2Pg08Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	textUcInput: any = {1: '마음이 편해지는 노래 듣기', 2: '근육이완', 3: '스트레칭, 요가', 4: '명상, 심호흡', 5: '책 읽기', 6: '양치하기', 7: '세수하기', 8: '샤워하기', 9: '가습기 물 채우기', 10: '방 환기하기', 11: '약 먹기', 12: '따뜻한 물, 꿀차 마시기', 13: '기타' };
 
	resultUcInput43: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false, 13:false };
	isUcInput43: boolean = false;
	sceneUcInput43: number = 43;

	orderUcInput44: any = {1: -1, 2: -1, 3: -1, 4: -1, 5: -1, 6: -1, 7: -1, 8: -1, 9: -1, 10: -1, 11: -1, 12: -1, 13: -1};
	resultUcInput44: any = {1: -1, 2: -1, 3: -1, 4: -1, 5: -1, 6: -1, 7: -1, 8: -1, 9: -1, 10: -1, 11: -1, 12: -1, 13: -1};
	stepUcInput44: number = 1;
	isUcInput44: boolean = false;
	sceneUcInput44: number = 44;

	resultUcInput45: any = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0};
	maxUcInput45: number = 30;
	minUcInput45: number = 15;
	isUcInput45: boolean = false;
	sceneUcInput45: number = 45;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 48;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 2;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 49;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}