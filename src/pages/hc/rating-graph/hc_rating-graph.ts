import { Component, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { StorageProvider } from '../../../providers/hc/storage/storage';
import { ApiProvider } from '../../../providers/hc/api/api';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'hc-page-rating-graph',
  templateUrl: 'hc_rating-graph.html',
})
export class HcRatingGraphPage {

	ratingNumItems:any;
	ratingDataItems:any;

	@ViewChild('lineCanvas') lineCanvas;

	lineChart: any;
	ratingText: string = '하루카드 기분평가 그래프';
	
	constructor(
		public screenOrientation: ScreenOrientation,
		public platform: Platform,
		public viewCtrl: ViewController,
		public navCtrl: NavController,
		public events: Events,
		public api: ApiProvider,
		public storage: StorageProvider,
		public navParams: NavParams) {

	}

	ngOnInit() {
		console.log('ngOnInit');

		this.ratingNumItems = this.storage.getLastRatingGraphFullNum();
		this.ratingDataItems = this.storage.getLastRatingGraphFullData();
	}

	ngAfterViewInit() {
		console.log("afterinit");

		// get current
		console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'

		if (this.platform.isPortrait() && (this.platform.is('ios') || this.platform.is('android'))) {
			// set to landscape
			this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).catch(function() {
				console.log("set to landscape error");
			});
		};

		setTimeout(() => {

			this.drawChart();
		}, 1000);

		// detect orientation changes
		this.screenOrientation.onChange().subscribe(() => {
				console.log("Orientation Changed");
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RatingGraphPage');
	}

	ngOnDestroy() {
		console.log('ngOnDestroy');

		if (this.platform.isLandscape() && (this.platform.is('ios') || this.platform.is('android'))) {
			// set to portrait
			this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).catch(function() {
				console.log("set to portrait error");
			});
		};
	}

	closeRatingGraphModal() {
		let data = { 'mode': 'close' };

		this.viewCtrl.dismiss(data);
	}

	drawChart()
	{
		this.lineChart = new Chart(this.lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: this.storage.getLastRatingGraphFullNum(),
				datasets: [{
					label: this.ratingText,
					fill: false,
					lineTension: 0,
					backgroundColor: "rgba(106, 104, 193, 0.4)",
					borderColor: "rgba(106, 104, 193, 1.0)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.1,
					borderJoinStyle: 'circle',
					pointBorderColor: "rgba(106, 104, 193, 1.0)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(106, 104, 193, 1.0)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: this.storage.getLastRatingGraphFullData(),
					spanGaps: false,
				}]
			},
			options: {
				legend: {
					display: true,
				},
				scales: {
					yAxes: [{
						ticks: {
							max : 10,
							min : 0,
							stepSize: 1
						}
					}],
					xAxes: [{
						ticks: {
							max : 48,
							min : 0,
							stepSize: 1
						}
					}],
				}
			}
		});	
	}
}
