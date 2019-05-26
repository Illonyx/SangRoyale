import { Component, OnInit} from '@angular/core';
import { ExportService } from './export.service';

export interface Clan {
  id : string;
  name : string;
}

@Component({
  selector: 'export-root',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent {
  selectedClan : Clan;
  selectedType : string;

  clans : Clan[] = [
    {"name":"Sang Royale", "id":"CJQLP2"}, //Problème sur l'ID de Sang Royale
    {"name":"Sang Royale II", "id":"2LUU0R0L"}, 
    {"name":"Sang Royale III", "id":"8CPG2YU"}, 
    {"name":"Sang Royale IV", "id":"8GQL980P"}, 
    {"name":"Sang Royale V", "id":"8VVGJPCR"}];
    
  types : string[] = ["GDC", "Activite"];

  constructor(private exportService: ExportService){}

  downloadReport(){
    console.log(JSON.stringify(this.selectedClan));
    var report = {
      data : this.selectedClan.id, 
      type : (this.selectedType == "GDC") ? "trophy" : "activity",
      output : "excel"
    }

    var that = this;
    this.exportService.generateReport(report).subscribe(function(data){
      console.log("Received data : " + data);
      that.exportService.exportAsExcelFile(data, 'sample');
    });

  }


  
}