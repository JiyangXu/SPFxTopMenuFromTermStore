import { IConfiguration, IStructure } from '../models';
import { ConfigService } from '../services';


export class GetStructure {
  public splitTheHeader(string){

  }

  public static getStructure(headerName:string, structureName: Array<IStructure>){
    var AllItems = structureName;
    var children =[];

    AllItems.forEach(function(value){
      //console.log(value.PathOfTerm);
      if(!value.PathOfTerm.search(headerName))
        // children.push(value.PathOfTerm);
        children.push(value);        
    })
    return children;
  }
} // class MissionService