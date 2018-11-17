export class Ht2Pg29Data {

	isUcSleepTime: any = { 1:false, 2:false, 3:false, 4:false };
	sceneUcSleepTime: any = { 1:1, 2:2, 3:3 };
	resultUcSleepTime: any = { 1:{'ampm': '오후', 'hour': 9, 'min': 0}, 2:{'ampm': '오후', 'hour': 10, 'min': 0}, 3:{'ampm': '오전', 'hour': 7, 'min': 0} };
	resultUcRangeTime: any = {1:{'hour':0, 'min': 0}, 2:{'hour':0, 'min': 0},3:{'hour':0, 'min': 0}};

	resultUcWakeTime: any = { 'hour': 0, 'min': 0 };
	countUcSleepTime: any = { 1:0, 2:0, 3:0, 4:0 };

	textUcInput49: any = {1:'여행', 2:'친구 만나기', 3:'동물 쓰다듬기', 4:'신혼여행', 5:'휴식', 6:'자연감상 (노을, 빗방울 등)', 7:'반신욕', 8:'산책',
	9:'찜질', 10:'온천', 11:'음악감상', 12:'소풍', 13:'마사지', 14:'드라이브', 15:'엄마품', 16:'차 마시기', 17:'등산', 18:'기타'};
	resultUcInput49: number = -1;
	isUcInput49: boolean = false;
	sceneUcInput49: number = 49;
	
	textUcInput52: any = {1:'산', 2:'친구', 3:'노을', 4:'바다', 5:'가족', 6:'빗방울', 7:'강', 8:'집안',
	9:'자동차', 10:'나무', 11:'물', 12:'꽃', 13:'침대', 14:'잔디(풀)', 15:'차/커피', 16:'기타'};
	resultUcInput52: number = -1;
	isUcInput52: boolean = false;
	sceneUcInput52: number = 52;

	textUcInput53: any = {1:'즐겁다', 2:'졸리다', 3:'안락하다', 4:'편안하다', 5:'감사하다', 6:'든든하다', 7:'행복하다', 8:'안정감이 든다',
	9:'상쾌하다', 10:'기쁘다', 11:'개운하다', 12:'나른하다', 13:'기타'};
	resultUcInput53: number = -1;
	isUcInput53: boolean = false;
	sceneUcInput53: number = 53;

	textUcInput54: any = {1:'밝다', 2:'화기애애하다', 3:'포근하다', 4:'어둡다', 5:'재미있다', 6:'상쾌하다', 7:'싱그럽다', 8:'흥겹다',
	9:'맑다', 10:'평화롭다', 11:'차분하다', 12:'조용하다', 13:'화사하다', 14:'기타'};
	resultUcInput54: number = -1;
	isUcInput54: boolean = false;
	sceneUcInput54: number = 54;

	textUcInput55: any = {1:'새소리', 2:'친구의 목소리', 3:'바람소리', 4:'가족의 목소리', 5:'빗방울 소리', 6:'아이의 목소리', 7:'물소리', 8:'다른 사람들 소리',
	9:'파도소리', 10:'악기 소리', 11:'뭔가 만드는 소리', 12:'기타'};
	resultUcInput55: number = -1;
	isUcInput55: boolean = false;
	sceneUcInput55: number = 55;

	textUcInput56: any = {1:'시원함', 2:'꽃 향기', 3:'따뜻함', 4:'풀 향기', 5:'상쾌함', 6:'바다 향기', 7:'근육이 풀림', 8:'아로마 향기', 9:'뜨거움',
	10:'아기 냄새', 11:'차가움', 12:'음식 냄새', 13:'기타'};
	resultUcInput56: number = -1;
	isUcInput56: boolean = false;
	sceneUcInput56: number = 56;

	isUcTime61: boolean = false;
	resultUcTime61: any = { 1:{'ampm': '오전', 'hour': 12, 'min': 0}, 2:{'ampm': '오전', 'hour': 12, 'min': 0} };
	sceneUcTime61: number = 61;

	textUcInput62: any = {1:'안방', 2:'화장실', 3:'서재', 4:'베란다', 5:'거실', 6:'다용도실', 7:'부엌', 8:'사무실', 9:'기타'};
	resultUcInput62: number = -1;
	isUcInput62: boolean = false;
	sceneUcInput62: number = 62;

	textUcInput63: any = {1:'노트', 2:'펜', 3:'타이머'};
	resultUcInput63: any = {1:false, 2:false, 3:false};
	isUcInput63: boolean = false;
	sceneUcInput63: number = 63;

	countUcQuiz1: number = 2;
	passUcQuiz1: number = 2;
	resultUcQuiz1: number = -1;
	isUcQuiz1: boolean = false;
	sceneUcQuiz1: number = 66;

	countUcQuiz2: number = 2;
	passUcQuiz2: number = 1;
	resultUcQuiz2: number = -1;
	isUcQuiz2: boolean = false;
	sceneUcQuiz2: number = 67;

	isUcPassed: boolean = false;
	sceneCurrent: number = 1;

	constructor(
	) { }
}