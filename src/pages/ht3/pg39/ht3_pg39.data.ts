export class Ht3Pg39Data {

	resultTodayAcheBody: any = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false, 13:false, 14:false};
	countTodayAcheBody: number = 0;
	selectTodayAcheBody: any = {1: -1, 2: -1, 3: -1};
	isTodayAcheBody: boolean = false;
	sceneTodayAcheBody: number = 1;

	textUcInput1:any = {
		1:'주치의를 바꾼다.', 2:'주치의에게 화를 낸다.', 3:'친구에게 하소연을 한다.',
		4:'질문을 적어 가서 보여준다.', 5:'인터넷에서 답을 찾고, 주치의에게 확인한다.', 6:'주치의가 답해줄 때까지 물어본다.'
	};
	textUcInput2:any = {1:'내가 할 수 있을 것 같아서', 2:'효과적일 것 같아서', 3:'준비가 쉬워서', 4:'계속해서 할 수 있을 것 같아서'};

	resultUcInput26: number = -1;
	isUcInput26: boolean = false;
	sceneUcInput26: number = 26;

	resultUcInput27: any = {1:false, 2:false, 3:false, 4:false};
	isUcInput27: boolean = false;
	sceneUcInput27: number = 27;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 2;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 44;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 3;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 45;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;
	
    constructor(
    ) { }   
}