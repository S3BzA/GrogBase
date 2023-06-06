import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Options, Wine, WineReview } from '../_types';

import { environment } from 'src/environments/environment';
import { Response } from '../_types';
import { UserService } from './user.service';
import { WineReviewRequest, WineReviewResponse } from '../_types/wine.interface';

@Injectable({
  providedIn: 'root'
})
export class WineService {

  constructor(
    private http: HttpClient,
    private user: UserService
  ) { }

  getAll(options?: Options<Wine>): Observable<Wine[]> {
    const sortBy = options?.sortBy;
    let search = options?.search;

    let params: any = {
      // should be replaced by actual authenticated API key
      api_key: this.user.currentUser!.api_key,
      type: "wines",
      return: ["*"]
    };

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

    const obs = this.http.post<Response<Wine[]>>(environment.apiEndpoint, params)
      .pipe(
        catchError(e => {
          console.error(e.error);
          return of(e.error)
        }),
        map(res => res.data));
    return obs;
  }

  update(wine: Wine) {
    alert("update wine: " + JSON.stringify(wine));
  }
  delete(wine: Wine) {
    alert("delete wine: " + JSON.stringify(wine));
  }
  review(rating: WineReview): Observable<boolean> {
    return this.http.post(environment.apiEndpoint, {
      api_key: this.user.currentUser!.api_key,
      type: 'insertReviewWines',
      target: {
        user_id: 1,
        wine_id: rating.wine_id
      },
      values: {
        points: rating.points,
        review: rating.review,
        drunk: rating.drunk
      }
    }).pipe(map(() => true));
  }

  getTopWines(options?: Options<Wine>): Observable<Wine[]> {
    let arr: any[] = [];
    const sortBy = options?.sortBy;
    if(sortBy) arr = arr.sort((a, b) => {
      if(a[sortBy.key] < b[sortBy.key]) return -1;
      if(a[sortBy.key] > b[sortBy.key]) return 1;
      return 0;
    });

    return of(arr);
  }

  getWineReviews(wine_id: number): Observable<WineReview[]>{

    const rqst: WineReviewRequest = {
      api_key: this.user.currentUser!.api_key,
      type: "getWineReviews",
      return: ["wine_id", "user_id", "points", "review", "drunk", "first_name", "last_name", "email", "name", "type"],
      search: {"wine_id": wine_id.toString()},
      fuzzy: false
    }

    return this.http.post<WineReviewResponse>(environment.apiEndpoint, rqst)
    .pipe(
      catchError(e => {
        console.error(e.error);
        return of(e.error)
      }),
      map(res => res.data)
      );

  }
}
