import { Component } from '@angular/core';
import { NavController, NavParams, Platform, App, Events } from 'ionic-angular';
import { UtilProvider } from '../../../providers/ht3/util/util';
import { StorageProvider } from '../../../providers/ht3/storage/storage';
import { ApiProvider } from '../../../providers/ht3/api/api';
import { Ht3PgConfig } from '../config/pg.config';
import { Ht3Pg01Data } from '../pg01/ht3_pg01.data';
import { Ht3Pg02Data } from '../pg02/ht3_pg02.data';
import { Ht3Pg03Data } from '../pg03/ht3_pg03.data';
import { Ht3Pg04Data } from '../pg04/ht3_pg04.data';
import { Ht3Pg05Data } from '../pg05/ht3_pg05.data';
import { Ht3Pg06Data } from '../pg06/ht3_pg06.data';
import { Ht3Pg07Data } from '../pg07/ht3_pg07.data';
import { Ht3Pg08Data } from '../pg08/ht3_pg08.data';
import { Ht3Pg09Data } from '../pg09/ht3_pg09.data';
import { Ht3Pg10Data } from '../pg10/ht3_pg10.data';
import { Ht3Pg11Data } from '../pg11/ht3_pg11.data';
import { Ht3Pg12Data } from '../pg12/ht3_pg12.data';
import { Ht3Pg13Data } from '../pg13/ht3_pg13.data';
import { Ht3Pg14Data } from '../pg14/ht3_pg14.data';
import { Ht3Pg15Data } from '../pg15/ht3_pg15.data';
import { Ht3Pg16Data } from '../pg16/ht3_pg16.data';
import { Ht3Pg17Data } from '../pg17/ht3_pg17.data';
import { Ht3Pg18Data } from '../pg18/ht3_pg18.data';
import { Ht3Pg19Data } from '../pg19/ht3_pg19.data';
import { Ht3Pg20Data } from '../pg20/ht3_pg20.data';
import { Ht3Pg21Data } from '../pg21/ht3_pg21.data';
import { Ht3Pg22Data } from '../pg22/ht3_pg22.data';
import { Ht3Pg23Data } from '../pg23/ht3_pg23.data';
import { Ht3Pg24Data } from '../pg24/ht3_pg24.data';
import { Ht3Pg25Data } from '../pg25/ht3_pg25.data';
import { Ht3Pg26Data } from '../pg26/ht3_pg26.data';
import { Ht3Pg27Data } from '../pg27/ht3_pg27.data';
import { Ht3Pg28Data } from '../pg28/ht3_pg28.data';
import { Ht3Pg29Data } from '../pg29/ht3_pg29.data';
import { Ht3Pg30Data } from '../pg30/ht3_pg30.data';
import { Ht3Pg31Data } from '../pg31/ht3_pg31.data';
import { Ht3Pg32Data } from '../pg32/ht3_pg32.data';
import { Ht3Pg33Data } from '../pg33/ht3_pg33.data';
import { Ht3Pg34Data } from '../pg34/ht3_pg34.data';
import { Ht3Pg35Data } from '../pg35/ht3_pg35.data';
import { Ht3Pg36Data } from '../pg36/ht3_pg36.data';
import { Ht3Pg37Data } from '../pg37/ht3_pg37.data';
import { Ht3Pg38Data } from '../pg38/ht3_pg38.data';
import { Ht3Pg39Data } from '../pg39/ht3_pg39.data';
import { Ht3Pg40Data } from '../pg40/ht3_pg40.data';
import { Ht3Pg41Data } from '../pg41/ht3_pg41.data';
import { Ht3Pg42Data } from '../pg42/ht3_pg42.data';
import { Ht3Pg43Data } from '../pg43/ht3_pg43.data';
import { Ht3Pg44Data } from '../pg44/ht3_pg44.data';
import { Ht3Pg45Data } from '../pg45/ht3_pg45.data';
import { Ht3Pg46Data } from '../pg46/ht3_pg46.data';
import { Ht3Pg47Data } from '../pg47/ht3_pg47.data';
// import { Ht3Pg48Data } from '../pg48/hc_48.data';

@IonicPage()
@Component({
  selector: 'ht3-page-list',
  templateUrl: 'ht3_list.html',
})
export class Ht3ListPage {

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
    public events: Events
  ){
      this.rootNavCtrl = this.appCtrl.getRootNavs()[0];
  }

  itemTapped(event, item) {
    console.log('itemTapped', item);

    this.openPage(item);
  }

  openPage(item) {

    if (item.num == 1) {
      let pgConfig = new Ht3PgConfig(item.num);

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Pg01Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 2) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg01Data();
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

      this.rootNavCtrl.push('Pg02Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 3) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg02Data();
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

      this.rootNavCtrl.push('Pg03Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 4) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg03Data();
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

      this.rootNavCtrl.push('Pg04Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 5) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg04Data();
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

      this.rootNavCtrl.push('Pg05Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 6) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg05Data();
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

      this.rootNavCtrl.push('Pg06Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 7) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg06Data();
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

      this.rootNavCtrl.push('Pg07Page', {
        itemTarget: item, sceneNumber: 1
      });  
    } else if (item.num == 8) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg07Data();
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

      this.rootNavCtrl.push('Pg08Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 9) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg08Data();
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

      this.rootNavCtrl.push('Pg09Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 10) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg09Data();
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

      this.rootNavCtrl.push('Pg10Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 11) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg10Data();
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

      this.rootNavCtrl.push('Pg11Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 12) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg11Data();
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

      this.rootNavCtrl.push('Pg12Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 13) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg12Data();
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

      this.rootNavCtrl.push('Pg13Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 14) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg13Data();
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

      this.rootNavCtrl.push('Pg14Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 15) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg14Data();
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

      this.rootNavCtrl.push('Pg15Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 16) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg15Data();
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

      this.rootNavCtrl.push('Pg16Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 17) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg16Data();
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

      this.rootNavCtrl.push('Pg17Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 18) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg17Data();
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

      this.rootNavCtrl.push('Pg18Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 19) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg18Data();
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

      this.rootNavCtrl.push('Pg19Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 20) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg19Data();
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

      this.rootNavCtrl.push('Pg20Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 21) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg20Data();
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

      this.rootNavCtrl.push('Pg21Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 22) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg21Data();
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

      this.rootNavCtrl.push('Pg22Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 23) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg22Data();
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

      this.rootNavCtrl.push('Pg23Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 24) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg23Data();
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

      this.rootNavCtrl.push('Pg24Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 25) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg24Data();
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

      this.rootNavCtrl.push('Pg25Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 26) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg25Data();
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

      this.rootNavCtrl.push('Pg26Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 27) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg26Data();
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

      this.rootNavCtrl.push('Pg27Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 28) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg27Data();
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

      this.rootNavCtrl.push('Pg28Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 29) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg28Data();
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

      this.rootNavCtrl.push('Pg29Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 30) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg29Data();
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

      this.rootNavCtrl.push('Pg30Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 31) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg30Data();
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

      this.rootNavCtrl.push('Pg31Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 32) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg31Data();
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

      this.rootNavCtrl.push('Pg32Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 33) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg32Data();
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

      this.rootNavCtrl.push('Pg33Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 34) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg33Data();
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

      this.rootNavCtrl.push('Pg34Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 35) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg34Data();
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

      this.rootNavCtrl.push('Pg35Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 36) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg35Data();
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

      this.rootNavCtrl.push('Pg36Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 37) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg36Data();
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

      this.rootNavCtrl.push('Pg37Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 38) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg37Data();
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

      this.rootNavCtrl.push('Pg38Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 39) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg38Data();
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

      this.rootNavCtrl.push('Pg39Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 40) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg39Data();
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

      this.rootNavCtrl.push('Pg40Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 41) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg40Data();
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

      this.rootNavCtrl.push('Pg41Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 42) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg41Data();
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

      this.rootNavCtrl.push('Pg42Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 43) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg42Data();
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

      this.rootNavCtrl.push('Pg43Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 44) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg43Data();
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

      this.rootNavCtrl.push('Pg44Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 45) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg44Data();
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

      this.rootNavCtrl.push('Pg45Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 46) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg45Data();
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

      this.rootNavCtrl.push('Pg46Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 47) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg46Data();
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

      this.rootNavCtrl.push('Pg47Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 48) {
      let pgConfig = new Ht3PgConfig(item.num);

      let dtPgPrev = new Ht3Pg47Data();
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

      this.rootNavCtrl.push('Pg48Page', {
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
      if (i <= 7) {
        this.z1items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 7 && i <= 18) {
        this.z2items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 18 && i <= 27) {
        this.z3items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 27 && i <= 38) {
        this.z4items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 38 && i <= 48) {
        this.z5items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      }

      i++;
    }

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
