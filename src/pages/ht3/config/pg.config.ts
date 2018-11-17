export class Ht3PgConfig {
	
	mcode = 'mdht';
	part_no = 3;

	numberPg: number = 1;
	pointQuiz: number = 0;

	todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);

	textAmPm:any = {'오전':'오전', '오후':'오후'};
	textHour:any = {0:'00시', 1:'01시', 2:'02시', 3:'03시', 4:'04시', 5:'05시', 6:'06시', 7:'07시', 8:'08시', 9:'09시', 10:'10시', 11:'11시', 12:'12시'};
	textMin:any = {0:'00분', 1: '01분', 2: '02분', 3:'03분', 4:'04분', 5:'05분', 6:'06분', 7:'07분', 8:'08분', 9:'09분', 10:'10분',
				 11: '11분', 12: '12분', 13:'13분', 14:'14분', 15:'15분', 16:'16분', 17:'17분', 18:'18분', 19:'19분', 20:'20분',
				 21: '21분', 22: '22분', 23:'23분', 24:'24분', 25:'25분', 26:'26분', 27:'27분', 28:'28분', 29:'29분', 30:'30분',
				 31: '31분', 32: '32분', 33:'33분', 34:'34분', 35:'35분', 36:'36분', 37:'37분', 38:'38분', 39:'39분', 40:'40분',
				 41: '41분', 42: '42분', 43:'43분', 44:'44분', 45:'45분', 46:'46분', 47:'47분', 48:'48분', 49:'49분', 50:'50분',
				 51: '51분', 52: '52분', 53:'53분', 54:'54분', 55:'55분', 56:'56분', 57:'57분', 58:'58분', 59:'59분'};

	isDebugCheckPrev: boolean = false;
	isDebugClearData: boolean = false;

	namePgClassCurrent:string = '';
	namePgClassPrev:string = '';

	textPgClass:any = { 0: '',
		 1: 'dtPg01',  2: 'dtPg02',  3: 'dtPg03',  4: 'dtPg04',  5: 'dtPg05',  6: 'dtPg06',  7: 'dtPg07',  8: 'dtPg08',  9: 'dtPg09', 10: 'dtPg10',
		11: 'dtPg11', 12: 'dtPg12', 13: 'dtPg13', 14: 'dtPg14', 15: 'dtPg15', 16: 'dtPg16', 17: 'dtPg17', 18: 'dtPg18', 19: 'dtPg19', 20: 'dtPg20',
		21: 'dtPg21', 22: 'dtPg22', 23: 'dtPg23', 24: 'dtPg24', 25: 'dtPg25', 26: 'dtPg26', 27: 'dtPg27', 28: 'dtPg28', 29: 'dtPg29', 30: 'dtPg30',
		31: 'dtPg31', 32: 'dtPg32', 33: 'dtPg33', 34: 'dtPg34', 35: 'dtPg35', 36: 'dtPg36', 37: 'dtPg37', 38: 'dtPg38', 39: 'dtPg39', 40: 'dtPg40',
		41: 'dtPg41', 42: 'dtPg42', 43: 'dtPg43', 44: 'dtPg44', 45: 'dtPg45', 46: 'dtPg46', 47: 'dtPg47', 48: 'dtPg48'
	};

	statusDebugCheckPrev:any = {
		 1: false,  2: false,  3: false,  4: false,  5: false,  6: false,  7: false,
		 8: false,  9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false, 16: false, 17: false, 18: false, 
		19: false, 20: false, 21: false, 22: false, 23: false, 24: false, 25: false, 26: false, 27: false,
		28: false, 29: false, 30: false, 31: false, 32: false, 33: false, 34: false, 35: false, 36: false, 37: false, 38: false,
		39: false, 40: false, 41: false, 42: false, 43: false, 44: false, 45: false, 46: false, 47: false, 48: false
	};

	statusDebugClearData:any = {
		 1: false,  2: false,  3: false,  4: false,  5: false,  6: false,  7: false,
		 8: false,  9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false, 16: false, 17: false, 18: false, 
		19: false, 20: false, 21: false, 22: false, 23: false, 24: false, 25: false, 26: false, 27: false,
		28: false, 29: false, 30: false, 31: false, 32: false, 33: false, 34: false, 35: false, 36: false, 37: false, 38: false,
		39: false, 40: false, 41: false, 42: false, 43: false, 44: false, 45: false, 46: false, 47: false, 48: false
	};

	textTodayAcheBody: any = {1: '머리', 2:'얼굴(안면)', 3:'치통', 4:'목', 5:'어깨', 6:'가슴', 7:'배', 8:'등허리', 9:'엉덩이', 10:'팔', 11:'손', 12:'다리', 13:'무릎', 14:'발'};

	sceneNumber:number = 1;
	sceneMaxNumber:number = 1;

	userInfo:any;

	objLineChart: any;
	isLineChartPassed: boolean = false;

	isTodayRead:boolean = false;

	itemTodayAcheRating: any;
	itemTodayAcheDays: Array<string> = [];
	itemTodayAcheGraphs: Array<number> = [];

	countTodayAcheRating:number = -1;
	isTodayAcheRating:boolean = false;
	sceneTodayAcheRating:number = 2;

	/*임시*/
	itemTodaySleepRating: any;
	itemTodaySleepDays: Array<string> = [];
	itemTodaySleepGraphs: Array<number> = [];

	countTodaySleepRating:number = -1;
	isTodaySleepRating:boolean = false;
	sceneTodaySleepRating:number = 4;

	volumeState:string = '1';

    constructor(numberPg:number=1) {
    	this.numberPg = numberPg;

    	if (numberPg > 0)
    	{
	    	this.isDebugCheckPrev = this.statusDebugCheckPrev[numberPg];
	    	this.isDebugClearData = this.statusDebugClearData[numberPg];
	    	this.namePgClassCurrent = this.textPgClass[numberPg];
	    	this.namePgClassPrev = this.textPgClass[numberPg -1];
    	}

    	if (numberPg == 1)
    	{
    		this.sceneTodayAcheRating = 25;
    	}
    }   
}
