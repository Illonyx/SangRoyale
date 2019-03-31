import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
export interface FileCheckObject {
  id : string;
  file : string;
  mdate : string;
  //mdate_activity : string;
  //mdate_trophies : string;
}


@Injectable({
  providedIn: 'root',
})
export class ExportService {

constructor(
  private httpClient: HttpClient
) {}

  getFileCheck() : Observable<FileCheckObject[]> {
    return this.httpClient.get<FileCheckObject[]>('/api/filecheck');
  };

/*
  generateActivityReport(clanId : string){
    return $http.get('/api/generate/activity/'+clanId)
  }

  generateTrophyReport(clanId : string){
    return $http.get('/api/generate/trophy/' + clanId)
  }
*/
}