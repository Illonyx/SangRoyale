import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
 
export interface FileCheckObject {
  id : string;
  file : string;
  mdate : string;
  //mdate_activity : string;
  //mdate_trophies : string;
}

export interface Report {
  data : string,
  type : string,
  output : string
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


  generateReport(report: Report){
    var urlToRequest = "/api/generate/" + report.type + "/" + report.data;
    return this.httpClient.get<any>(urlToRequest);
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  public formatGdcReport(renderParams, participants){
    
    let table = [];
    table.push("name");
    table.push("tag");

    //Imprimer la 1ere ligne du rapport Excel
    var firstLineToken : Object = {
      name : "Toutes guerres", 
      tag : '/'
    };
    
    renderParams.forEach(function(renderParam){
      firstLineToken[renderParam.cardsEarnedLabel] = renderParam.standingStat;
      firstLineToken[renderParam.finalResultLabel] = renderParam.battleStat;
      table.push(renderParam.cardsEarnedLabel);
      table.push(renderParam.finalResultLabel);
    })

    //Sélectionner les participants selon les filtres choisis
    participants = participants.map(function(participant){
      return _.transform(participant, function(result, value, key) {
        if(_.includes(table, key)) result[key] = value;
      }, {});
    })

    participants.unshift(firstLineToken);
    return participants;
  }

}