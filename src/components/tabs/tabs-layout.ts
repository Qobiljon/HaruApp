import { Component, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'tabs-layout',
    templateUrl: 'tabs.html'
})

export class TabsLayout {
    @Input('tabIndex') tabIndex: any;
    @Input('data') data: any;
    @Input('events') events: any;
    @ViewChild('tabs') tabRef: any;

    constructor(public ev: Events) {}

	takeTabPage(page) {
		this.ev.publish('tabs:changed', page);
	}
}
