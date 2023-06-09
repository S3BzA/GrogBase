import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Options, Response, Winery, WineryReview } from '../_types';
import { WineryRequest } from '../_types/request.interface';
import { UiService } from './ui.service';
import { UserService } from './user.service';

import { WineryReviewRequest } from '../_types';
import { handleResponse } from './util';


@Injectable({
  providedIn: 'root'
})
export class WineryService {

  constructor(
    private http: HttpClient,
    private user: UserService,
    private ui: UiService
  ) { }

  /**
    * Retrieves a list of all countries with
    * wineries in the database
    */
  getCountries(): Observable<string[]> {
    return this.http.post<Response<string[]>>(environment.apiEndpoint, {
      type: 'getCountries',
      api_key: this.user.currentUser!.api_key,
      limit: 500
    }).pipe(handleResponse(this.ui));
  }

  /**
    * Retrieves all entries from the database with
    * no filtering applied
    * @param options Optional return parameters
    * @return The array of wineries
    */
  getAll(options?: Options<Winery>): Observable<Winery[]> {
    const sortBy = options?.sortBy;
    let search = options?.search;

    let params: any = {
      // should be replaced by actual authenticated API key
      api_key: this.user.currentUser!.api_key,
      type: WineryRequest.GetAll,
      return: options?.return || ["*"],
      search: {}
    };

    if(options?.limit) {
      params.limit = options.limit;
    }

    if(sortBy) {
      params.sort = sortBy.key;
      params.order = sortBy.order;
    }

    if(search) {
      // filter out search paramters containing null values
      search = Object.fromEntries(
        Object.entries(search)
        .filter(([_, value]) => {
          return ![undefined, null].includes(value as any);
        }));

      // API doesn't accept empty search objects
      if(Object.keys(search).length > 0) {
        params.search = search;
        params.fuzzy = true;
      }
    }
    params.search.active = "1";

    const obs = this.http.post<Response<Winery[]>>(environment.apiEndpoint, params)
      .pipe(
        handleResponse(this.ui)
      );
    return obs;
  }

  /**
    * Updates the data of a winery
    * @param winery The winery to update
    * @return Whether the update was successful
    */
  update(winery: Winery): Observable<boolean> {
    return this.http.post<Response<string>>(environment.apiEndpoint, {
      api_key: this.user.currentUser!.api_key,
      type: WineryRequest.Update,
      update: winery
    }).pipe(
      handleResponse(this.ui),
      map(() => true)
    );
  }

  /**
    * Adds a new winery to the database
    * @param winery The winery to add
    * @return Whether the insert was successful
    */
  insert(winery: any): Observable<boolean> {
    return this.http.post<Response<string>>(environment.apiEndpoint, {
      api_key: this.user.currentUser!.api_key,
      type: WineryRequest.Add,
      wineries: [{
        ...winery,
        manager_id: 5
      }]
    }).pipe(
      handleResponse(this.ui),
      map(() => true)
    );
  }

  /**
    * Updates the data of a winery
    * @param winery The winery to delete
    * @return Whether the update was successful
    */
  delete(winery: Winery): Observable<boolean> {
    return this.http.post(environment.apiEndpoint, {
      api_key: this.user.currentUser!.api_key,
      type: WineryRequest.Delete,
      winery_id: winery.winery_id
    }).pipe(map(() => true));
  }

  review(rating: WineryReview): Observable<string> {
    console.log(rating);
    return this.http.post<Response<string>>(environment.apiEndpoint, {
      api_key: this.user.currentUser!.api_key,
      type: WineryRequest.Review,
      target: {
        winery_id: rating.winery_id
      },
      values: {
        points: rating,
        review: rating.review
      }
    }).pipe(handleResponse(this.ui));
  }

  getTopWineries(): Observable<Winery[]> {
    return this.getAll({
      limit: 5
    });
  }

  getWineryReviews(winery_id: number): Observable<WineryReview[]>{

    const rqst : WineryReviewRequest = {
      api_key: this.user.currentUser!.api_key,
      type: "getWineryReviews",
      return: ["winery_id", "user_id", "points", "review", "first_name", "last_name", "email", "name", "user_type"],
      search: {"winery_id": winery_id.toString()},
      fuzzy: false
    }

    return this.http.post<Response<WineryReview[]>>(environment.apiEndpoint, rqst)
    .pipe(
      handleResponse(this.ui)
    );
  }
}
