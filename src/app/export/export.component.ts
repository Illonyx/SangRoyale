import { Component, OnInit} from '@angular/core';
import { ExportService } from './export.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import {DateAdapter} from '@angular/material';


export interface Clan {
  id : string;
  name : string;
}

export interface GdcRenderParam {
  warEndTime : number,
  cardsEarnedLabel : string,
  finalResultLabel : string,
  standingStat : string,
  battleStat : string
}

@Component({
  selector: 'export-root',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent {
  selectedClan : Clan;
  selectedType : string;

  progressString : string;
  progressValue : number;
  raisedError : boolean = false;
  errorReason : string;

  dateMin = new FormControl();
  dateMax = new FormControl(new Date());
  checked : boolean = false;

  clans : Clan[] = [
    {"name":"Sang Royale", "id":"CJQLP2"}, //Problème sur l'ID de Sang Royale
    {"name":"Sang Royale II", "id":"2LUU0R0L"}, 
    {"name":"Sang Royale III", "id":"8CPG2YU"}, 
    {"name":"Sang Royale IV", "id":"8GQL980P"}, 
    {"name":"Sang Royale V", "id":"8VVGJPCR"}];
    
  types : string[] = ["GDC", "Trophées"];

  constructor(private dateAdapter: DateAdapter<Date>, private exportService: ExportService) {
    this.dateAdapter.setLocale('fr');   
  }

  findClanAcronym = function(clanName){
    var acronym = ""
    clanName = clanName.replace(/ +/g, "");
    for(var i=0;i<clanName.length;i++){
      var character = clanName[i]
      if(character == character.toUpperCase()){
        acronym += character
      }
    }
    return acronym.toLowerCase()
  }

  downloadReport(){
    console.log(JSON.stringify(this.selectedClan));
    var report = {
      data : this.selectedClan.id, 
      type : (this.selectedType == "GDC") ? "gdc" : "trophy",
      output : "excel"
    }

    var that = this;

    this.progressString = "Téléchargement des données à exporter depuis RoyaleApi (1/2)";
    this.progressValue = 0;


    this.exportService.generateReport(report).subscribe(function(data){
      console.log("Received data : " + JSON.stringify(data));

      that.progressString = "Données correctement reçues. Préparation du rapport (2/2) "
      that.progressValue = 60;

      //Si le rapport est de type GDC
      if(data.renderParams){
        let renderParams : Array<GdcRenderParam> = data.renderParams;
        let participants : Array<any> = data.participants;

        //Filtre sur les dates à appliquer
        renderParams = that.filterByDate(that.dateMin, that.dateMax, renderParams);

        //Tri sur les dates à appliquer (sens croissant/décroissant)
        renderParams = that.sortByDate(renderParams);

        //Préparation de la première ligne du rapport
        data = that.exportService.formatGdcReport(renderParams, participants);
      }

      let reportName = that.selectedType + "-" + that.findClanAcronym(that.selectedClan.name);
      that.exportService.exportAsExcelFile(data, reportName);

      that.progressString = "Génération du rapport terminé ";
      that.progressValue = 100;
    }, function(error){
      that.raisedError = true;
      that.errorReason = "Erreur soulevée pendant le téléchargement des données du rapport, eventuellement reessayer : " + error.error.status.message;
    });

  }

  filterByDate(dateMin, dateMax, renderParams){

    if(dateMin.value && dateMax.value){
      let dateMinValue : Date = dateMin.value;
      let dateMaxValue : Date = dateMax.value;
  
      return renderParams.filter(function(renderParam){
        //console.log("az-" + renderParam.warEndTime.valueOf() + "az2-" + dateMinValue.valueOf() + "/az3-" + renderParam.warEndTime.valueOf() + "/az4-" + dateMaxValue.valueOf());
        return renderParam.warEndTime.valueOf() >= dateMinValue.valueOf() && renderParam.warEndTime.valueOf() <= dateMaxValue.valueOf();
      })
    } else return renderParams;
  }

  sortByDate(renderParams){

    if(this.checked){
      //Tri à faire en fonction des dates :)
      return renderParams.sort(function(clanwar1, clanwar2){
        return clanwar1.warEndTime - clanwar2.warEndTime;
      })
    } else return renderParams;

  }
  
}