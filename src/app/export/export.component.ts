import { Component, OnInit} from '@angular/core';
import { ExportService } from './export.service';

export interface Clan {
  id : string;
  name : string;
}

export interface GdcRenderParam {
  createdDate : number,
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

  clans : Clan[] = [
    {"name":"Sang Royale", "id":"CJQLP2"}, //Problème sur l'ID de Sang Royale
    {"name":"Sang Royale II", "id":"2LUU0R0L"}, 
    {"name":"Sang Royale III", "id":"8CPG2YU"}, 
    {"name":"Sang Royale IV", "id":"8GQL980P"}, 
    {"name":"Sang Royale V", "id":"8VVGJPCR"}];
    
  types : string[] = ["GDC", "Trophées"];

  constructor(private exportService: ExportService){}

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

        //Préparation de la première ligne du rapport
        let firstLine : object = that.renderFirstLine(renderParams);
        participants.unshift(firstLine);
        data = participants;
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

  renderFirstLine(renderParams : Array<GdcRenderParam>){

    //Tri à faire en fonction des dates :)
    //data.sort(function(clanwar1, clanwar2){
    //  return clanwar1.createdDate - clanwar2.createdDate;
    //})

    //Parcourir les renderParams
    var firstLineToken : Object = {
      name : "Toutes guerres", 
      tag : '/'
    };
    renderParams.forEach(function(renderParam){
      firstLineToken[renderParam.cardsEarnedLabel] = renderParam.standingStat;
      firstLineToken[renderParam.finalResultLabel] = renderParam.battleStat;
    })

    return firstLineToken;
  }


  
}