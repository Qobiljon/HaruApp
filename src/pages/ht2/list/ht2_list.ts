import { Component } from '@angular/core';
import { NavController, NavParams, Platform, App, Events, IonicPage } from 'ionic-angular';
import { UtilProvider } from '../../../providers/util/util';
import { StorageProvider } from '../../../providers/storage/storage';
import { ApiProvider } from '../../../providers/api/api';
import { Ht2PgConfig } from '../config/pg.config';
import { Ht2Pg01Data } from '../pg01/ht2_pg01.data';
import { Ht2Pg02Data } from '../pg02/ht2_pg02.data';
import { Ht2Pg03Data } from '../pg03/ht2_pg03.data';
import { Ht2Pg04Data } from '../pg04/ht2_pg04.data';
import { Ht2Pg05Data } from '../pg05/ht2_pg05.data';
import { Ht2Pg06Data } from '../pg06/ht2_pg06.data';
import { Ht2Pg07Data } from '../pg07/ht2_pg07.data';
import { Ht2Pg08Data } from '../pg08/ht2_pg08.data';
import { Ht2Pg09Data } from '../pg09/ht2_pg09.data';
import { Ht2Pg10Data } from '../pg10/ht2_pg10.data';
import { Ht2Pg11Data } from '../pg11/ht2_pg11.data';
import { Ht2Pg12Data } from '../pg12/ht2_pg12.data';
import { Ht2Pg13Data } from '../pg13/ht2_pg13.data';
import { Ht2Pg14Data } from '../pg14/ht2_pg14.data';
import { Ht2Pg15Data } from '../pg15/ht2_pg15.data';
import { Ht2Pg16Data } from '../pg16/ht2_pg16.data';
import { Ht2Pg17Data } from '../pg17/ht2_pg17.data';
import { Ht2Pg18Data } from '../pg18/ht2_pg18.data';
import { Ht2Pg19Data } from '../pg19/ht2_pg19.data';
import { Ht2Pg20Data } from '../pg20/ht2_pg20.data';
import { Ht2Pg21Data } from '../pg21/ht2_pg21.data';
import { Ht2Pg22Data } from '../pg22/ht2_pg22.data';
import { Ht2Pg23Data } from '../pg23/ht2_pg23.data';
import { Ht2Pg24Data } from '../pg24/ht2_pg24.data';
import { Ht2Pg25Data } from '../pg25/ht2_pg25.data';
import { Ht2Pg26Data } from '../pg26/ht2_pg26.data';
import { Ht2Pg27Data } from '../pg27/ht2_pg27.data';
import { Ht2Pg28Data } from '../pg28/ht2_pg28.data';
import { Ht2Pg29Data } from '../pg29/ht2_pg29.data';
import { Ht2Pg30Data } from '../pg30/ht2_pg30.data';
import { Ht2Pg31Data } from '../pg31/ht2_pg31.data';
import { Ht2Pg32Data } from '../pg32/ht2_pg32.data';
import { Ht2Pg33Data } from '../pg33/ht2_pg33.data';
import { Ht2Pg34Data } from '../pg34/ht2_pg34.data';
import { Ht2Pg35Data } from '../pg35/ht2_pg35.data';
import { Ht2Pg36Data } from '../pg36/ht2_pg36.data';
import { Ht2Pg37Data } from '../pg37/ht2_pg37.data';
import { Ht2Pg38Data } from '../pg38/ht2_pg38.data';
import { Ht2Pg39Data } from '../pg39/ht2_pg39.data';
import { Ht2Pg40Data } from '../pg40/ht2_pg40.data';
import { Ht2Pg41Data } from '../pg41/ht2_pg41.data';
import { Ht2Pg42Data } from '../pg42/ht2_pg42.data';
import { Ht2Pg43Data } from '../pg43/ht2_pg43.data';
import { Ht2Pg44Data } from '../pg44/ht2_pg44.data';
import { Ht2Pg45Data } from '../pg45/ht2_pg45.data';
import { Ht2Pg46Data } from '../pg46/ht2_pg46.data';
import { Ht2Pg47Data } from '../pg47/ht2_pg47.data';
// import { Ht2Pg48Data } from '../pg48/hc_48.data';

@IonicPage()
@Component({
  selector: 'ht2-page-list',
  templateUrl: 'ht2_list.html',
})
export class Ht2ListPage {

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
      let pgConfig = new Ht2PgConfig(item.num);

      if (pgConfig.isDebugClearData)
      {
        // 사용자데이터 삭제
        this.storage.remove(pgConfig.namePgClassCurrent);    
      }

      this.util.toast('선택한 회기가 열립니다.');

      this.rootNavCtrl.push('Ht2Pg01Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 2) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg01Data();
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

      this.rootNavCtrl.push('Ht2Pg02Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 3) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg02Data();
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

      this.rootNavCtrl.push('Ht2Pg03Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 4) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg03Data();
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

      this.rootNavCtrl.push('Ht2Pg04Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 5) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg04Data();
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

      this.rootNavCtrl.push('Ht2Pg05Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 6) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg05Data();
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

      this.rootNavCtrl.push('Ht2Pg06Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 7) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg06Data();
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

      this.rootNavCtrl.push('Ht2Pg07Page', {
        itemTarget: item, sceneNumber: 1
      });  
    } else if (item.num == 8) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg07Data();
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

      this.rootNavCtrl.push('Ht2Pg08Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 9) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg08Data();
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

      this.rootNavCtrl.push('Ht2Pg09Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 10) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg09Data();
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

      this.rootNavCtrl.push('Ht2Pg10Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 11) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg10Data();
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

      this.rootNavCtrl.push('Ht2Pg11Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 12) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg11Data();
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

      this.rootNavCtrl.push('Ht2Pg12Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 13) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg12Data();
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

      this.rootNavCtrl.push('Ht2Pg13Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 14) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg13Data();
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

      this.rootNavCtrl.push('Ht2Pg14Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 15) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg14Data();
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

      this.rootNavCtrl.push('Ht2Pg15Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 16) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg15Data();
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

      this.rootNavCtrl.push('Ht2Pg16Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 17) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg16Data();
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

      this.rootNavCtrl.push('Ht2Pg17Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 18) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg17Data();
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

      this.rootNavCtrl.push('Ht2Pg18Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 19) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg18Data();
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

      this.rootNavCtrl.push('Ht2Pg19Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 20) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg19Data();
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

      this.rootNavCtrl.push('Ht2Pg20Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 21) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg20Data();
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

      this.rootNavCtrl.push('Ht2Pg21Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 22) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg21Data();
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

      this.rootNavCtrl.push('Ht2Pg22Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 23) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg22Data();
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

      this.rootNavCtrl.push('Ht2Pg23Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 24) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg23Data();
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

      this.rootNavCtrl.push('Ht2Pg24Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 25) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg24Data();
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

      this.rootNavCtrl.push('Ht2Pg25Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 26) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg25Data();
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

      this.rootNavCtrl.push('Ht2Pg26Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 27) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg26Data();
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

      this.rootNavCtrl.push('Ht2Pg27Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 28) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg27Data();
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

      this.rootNavCtrl.push('Ht2Pg28Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 29) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg28Data();
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

      this.rootNavCtrl.push('Ht2Pg29Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 30) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg29Data();
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

      this.rootNavCtrl.push('Ht2Pg30Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 31) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg30Data();
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

      this.rootNavCtrl.push('Ht2Pg31Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 32) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg31Data();
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

      this.rootNavCtrl.push('Ht2Pg32Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 33) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg32Data();
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

      this.rootNavCtrl.push('Ht2Pg33Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 34) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg33Data();
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

      this.rootNavCtrl.push('Ht2Pg34Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 35) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg34Data();
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

      this.rootNavCtrl.push('Ht2Pg35Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 36) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg35Data();
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

      this.rootNavCtrl.push('Ht2Pg36Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 37) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg36Data();
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

      this.rootNavCtrl.push('Ht2Pg37Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 38) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg37Data();
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

      this.rootNavCtrl.push('Ht2Pg38Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 39) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg38Data();
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

      this.rootNavCtrl.push('Ht2Pg39Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 40) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg39Data();
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

      this.rootNavCtrl.push('Ht2Pg40Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 41) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg40Data();
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

      this.rootNavCtrl.push('Ht2Pg41Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 42) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg41Data();
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

      this.rootNavCtrl.push('Ht2Pg42Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 43) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg42Data();
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

      this.rootNavCtrl.push('Ht2Pg43Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 44) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg43Data();
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

      this.rootNavCtrl.push('Ht2Pg44Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 45) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg44Data();
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

      this.rootNavCtrl.push('Ht2Pg45Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 46) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg45Data();
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

      this.rootNavCtrl.push('Ht2Pg46Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 47) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg46Data();
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

      this.rootNavCtrl.push('Ht2Pg47Page', {
        itemTarget: item, sceneNumber: 1
      });
    } else if (item.num == 48) {
      let pgConfig = new Ht2PgConfig(item.num);

      let dtPgPrev = new Ht2Pg47Data();
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

      this.rootNavCtrl.push('Ht2Pg48Page', {
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
      } else if (i > 7 && i <= 15) {
        this.z2items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 15 && i <= 26) {
        this.z3items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday });
      } else if (i > 26 && i <= 38) {
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
