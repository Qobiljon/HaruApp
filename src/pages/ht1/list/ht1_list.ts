import { Component } from '@angular/core';
import { NavController, NavParams, Platform, App, Events, IonicPage } from 'ionic-angular';
import { UtilProvider } from '../../../providers/util/util';
import { StorageProvider } from '../../../providers/storage/storage';
import { ApiProvider } from '../../../providers/api/api';
import { Ht1PgConfig } from '../config/pg.config';
import { Ht1Pg01Data } from '../pg01/ht1_pg01.data';
import { Ht1Pg02Data } from '../pg02/ht1_pg02.data';
import { Ht1Pg03Data } from '../pg03/ht1_pg03.data';
import { Ht1Pg04Data } from '../pg04/ht1_pg04.data';
import { Ht1Pg05Data } from '../pg05/ht1_pg05.data';
import { Ht1Pg06Data } from '../pg06/ht1_pg06.data';
import { Ht1Pg07Data } from '../pg07/ht1_pg07.data';
import { Ht1Pg08Data } from '../pg08/ht1_pg08.data';
import { Ht1Pg09Data } from '../pg09/ht1_pg09.data';
import { Ht1Pg10Data } from '../pg10/ht1_pg10.data';
import { Ht1Pg11Data } from '../pg11/ht1_pg11.data';
import { Ht1Pg12Data } from '../pg12/ht1_pg12.data';
import { Ht1Pg13Data } from '../pg13/ht1_pg13.data';
import { Ht1Pg14Data } from '../pg14/ht1_pg14.data';
import { Ht1Pg15Data } from '../pg15/ht1_pg15.data';
import { Ht1Pg16Data } from '../pg16/ht1_pg16.data';
import { Ht1Pg17Data } from '../pg17/ht1_pg17.data';
import { Ht1Pg18Data } from '../pg18/ht1_pg18.data';
import { Ht1Pg19Data } from '../pg19/ht1_pg19.data';
import { Ht1Pg20Data } from '../pg20/ht1_pg20.data';
import { Ht1Pg21Data } from '../pg21/ht1_pg21.data';
import { Ht1Pg22Data } from '../pg22/ht1_pg22.data';
import { Ht1Pg23Data } from '../pg23/ht1_pg23.data';
import { Ht1Pg24Data } from '../pg24/ht1_pg24.data';
import { Ht1Pg25Data } from '../pg25/ht1_pg25.data';
import { Ht1Pg26Data } from '../pg26/ht1_pg26.data';
import { Ht1Pg27Data } from '../pg27/ht1_pg27.data';
import { Ht1Pg28Data } from '../pg28/ht1_pg28.data';
import { Ht1Pg29Data } from '../pg29/ht1_pg29.data';
import { Ht1Pg30Data } from '../pg30/ht1_pg30.data';
import { Ht1Pg31Data } from '../pg31/ht1_pg31.data';
import { Ht1Pg32Data } from '../pg32/ht1_pg32.data';
import { Ht1Pg33Data } from '../pg33/ht1_pg33.data';
import { Ht1Pg34Data } from '../pg34/ht1_pg34.data';
import { Ht1Pg35Data } from '../pg35/ht1_pg35.data';
import { Ht1Pg36Data } from '../pg36/ht1_pg36.data';
import { Ht1Pg37Data } from '../pg37/ht1_pg37.data';
import { Ht1Pg38Data } from '../pg38/ht1_pg38.data';
import { Ht1Pg39Data } from '../pg39/ht1_pg39.data';
import { Ht1Pg40Data } from '../pg40/ht1_pg40.data';
import { Ht1Pg41Data } from '../pg41/ht1_pg41.data';
import { Ht1Pg42Data } from '../pg42/ht1_pg42.data';
import { Ht1Pg43Data } from '../pg43/ht1_pg43.data';
import { Ht1Pg44Data } from '../pg44/ht1_pg44.data';
import { Ht1Pg45Data } from '../pg45/ht1_pg45.data';
import { Ht1Pg46Data } from '../pg46/ht1_pg46.data';
import { Ht1Pg47Data } from '../pg47/ht1_pg47.data';
// import { Ht1Pg48Data } from '../pg48/hc_48.data';

@IonicPage()
@Component({
  selector: 'ht1-page-list',
  templateUrl: 'ht1_list.html',
})
export class Ht1ListPage {

  selectedItem: any;

  z1items: Array<{num: number, pnum: number, mtitle: string, ztitle: string, ptitle: string, mcode: string, zcode: string, pcode: string, count: number, targetdate: string, targetday: string }> = [];

  z2items: Array<{num: number, pnum: number, mtitle: string, ztitle: string, ptitle: string, mcode: string, zcode: string, pcode: string, count: number, targetdate: string, targetday: string }> = [];

  z3items: Array<{num: number, pnum: number, mtitle: string, ztitle: string, ptitle: string, mcode: string, zcode: string, pcode: string, count: number, targetdate: string, targetday: string }> = [];

  z4items: Array<{num: number, pnum: number, mtitle: string, ztitle: string, ptitle: string, mcode: string, zcode: string, pcode: string, count: number, targetdate: string, targetday: string }> = [];

  z5items: Array<{num: number, pnum: number, mtitle: string, ztitle: string, ptitle: string, mcode: string, zcode: string, pcode: string, count: number, targetdate: string, targetday: string }> = [];

  rootNavCtrl: NavController;
  viewMode: boolean = false;

  todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
  todayCount: number = 1;

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public util: UtilProvider,
    public storage: StorageProvider,
    public api: ApiProvider,
    public events: Events)
  {
      this.rootNavCtrl = this.appCtrl.getRootNavs()[0];
  }

  itemTapped(event, item) {
      console.log('itemTapped', item);

      this.openPage(item);
  }

  openPage(item) {

    if (item.num == 1) {
      let pgConfig = new Ht1PgConfig(item.num);

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg01Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 2) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg01Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg02Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 3) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg02Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg03Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 4) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg03Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg04Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 5) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg04Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg05Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 6) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg05Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg06Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 7) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg06Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg07Page', {
        itemTarget: item, sceneNumber: 1
      });  
    } else if (item.num == 8) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg07Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg08Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 9) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg08Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg09Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 10) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg09Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg10Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 11) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg10Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg11Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 12) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg11Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg12Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 13) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg12Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg13Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 14) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg13Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg14Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 15) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg14Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg15Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 16) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg15Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg16Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 17) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg16Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg17Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 18) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg17Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg18Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 19) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg18Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg19Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 20) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg19Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg20Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 21) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg20Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg21Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 22) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg21Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg22Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 23) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg22Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg23Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 24) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg23Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg24Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 25) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg24Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg25Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 26) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg25Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg26Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 27) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg26Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg27Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 28) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg27Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg28Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 29) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg28Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg29Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 30) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg29Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg30Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 31) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg30Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg31Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 32) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg31Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg32Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 33) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg32Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg33Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 34) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg33Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg34Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 35) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg34Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg35Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 36) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg35Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg36Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 37) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg36Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg37Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 38) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg37Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg38Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 39) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg38Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg39Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 40) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg39Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg40Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 41) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg40Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg41Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 42) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg41Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg42Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 43) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg42Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg43Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 44) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg43Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg44Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 45) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg44Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg45Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 46) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg45Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg46Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 47) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg46Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg47Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 48) {
      let pgConfig = new Ht1PgConfig(item.num);

      let dtPgPrev = new Ht1Pg47Data();
      dtPgPrev = this.storage.getObject(pgConfig.namePgClassPrev);

      if (typeof dtPgPrev == 'undefined' || dtPgPrev == null || dtPgPrev.isUcPassed == false)
      {
        if (!pgConfig.isDebugCheckPrev)
        {
          this.util.alert('이전 회기 진행을 완료하지 않았습니다.');
          return;
        }
      }

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht1Pg48Page', {
        itemTarget: item, sceneNumber: 1
      });
    }  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');

    let haruTodayMenu = this.storage.getHaruTodayMenu();

    console.log('haruTodayMenu :', haruTodayMenu);

    this.z1items.length = 0;
    this.z2items.length = 0;
    this.z3items.length = 0;
    this.z4items.length = 0;
    this.z5items.length = 0;

    let i = 1;
    for (let item of haruTodayMenu) {
      if (i <= 6) {
        this.z1items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 6 && i <= 13) {
        this.z2items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 13 && i <= 24) {
        this.z3items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 24 && i <= 38) {
        this.z4items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 38 && i <= 48) {
        this.z5items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      }

      i++;
    }

    this.selectedItem = this.navParams.get('item');

    let item = this.storage.getSelectHaruTodayItem();

    if (item != null)
    {
      // 아이템을 선택 했을때
      this.storage.clearSelectHaruTodayItem();

      this.selectedItem = item;

      this.openPage(this.selectedItem);
    }

  }
}
