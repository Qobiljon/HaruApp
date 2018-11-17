export class Ht3Pg40Data {

	resultTodayAcheBody: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false, 13:false, 14:false};
	countTodayAcheBody: number = 0;
	selectTodayAcheBody: any = {1: -1, 2: -1, 3: -1};
	isTodayAcheBody: boolean = false;
	sceneTodayAcheBody: number = 1;

	textUcInput1: any = {1:'전문가가 쓴 책을 본다.', 2:'주치의에게 묻는다.', 3:'난소암 인터넷 카페에 묻는다.'};
	textUcInput2: any = {1:'내가 할 수 있을 것 같아서', 2:'효과적일 것 같아서', 3:'준비가 쉬워서', 4:'계속해서 할 수 있을 것 같아서'};

	resultUcInput19: number = -1;
	isUcInput19: boolean = false;
	sceneUcInput19: number = 19;

	resultUcInput20: any = {1:false, 2:false, 3:false, 4:false};
	isUcInput20: boolean = false;
	sceneUcInput20: number = 20;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 3;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 32;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 4;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 33;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}