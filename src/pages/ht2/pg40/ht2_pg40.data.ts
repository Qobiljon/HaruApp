export class Ht2Pg40Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };
	
	textUcInput1: any = {1:'전문가가 쓴 책을 본다.', 2:'주치의에게 묻는다.', 3:'난소암 인터넷 카페에 묻는다.'};
	textUcInput2: any = {1:'내가 할 수 있을 것 같아서', 2:'효과적일 것 같아서', 3:'준비가 쉬워서', 4:'계속해서 할 수 있을 것 같아서'};

	resultUcInput21: number = -1;
	isUcInput21: boolean = false;
	sceneUcInput21: number = 21;

	resultUcInput22: any = {1:false, 2:false, 3:false, 4:false};
	isUcInput22: boolean = false;
	sceneUcInput22: number = 22;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 34;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 4;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 35;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}