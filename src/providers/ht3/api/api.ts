import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiProvider {

	api_base:string = 'https://www.haruapp.net/api/';

	constructor(public http : Http)
	{
		console.log('Api Provider');
	}

	postData(url: string, object: Object) : Promise<JSON> { 
		let headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');

		return this.http.post( this.api_base + url, JSON.stringify(object), { headers: headers }).map((response) => {                
          	return response.json();
     	}).toPromise();
	}
}