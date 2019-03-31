import { Component, OnInit} from '@angular/core';
import { ExportService } from './export.service';
@Component({
  selector: 'export-root',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  fileCheck=[]

  sangRoyaleFamily = [
    {"name":"Sang Royale", "id":"CJQLP2"}, 
    {"name":"Sang Royale II", "id":"2LUU0R0L"}, 
    {"name":"Sang Royale III", "id":"8CPG2YU"}, 
    {"name":"Sang Royale IV", "id":"8GQL980P"}, 
    {"name":"Sang Royale V", "id":"8VVGJPCR"}]

  constructor(private exportService: ExportService){}

   ngOnInit() {
    this.exportService.getFileCheck().subscribe(data => {
      console.log(JSON.stringify(data));
      this.fileCheck=data;
    });
  }

  
}