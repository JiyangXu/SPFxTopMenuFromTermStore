import { IConfiguration } from '../models';

export class ConfigService {

  private static _headers: IConfiguration[] = <IConfiguration[]>[
    
    {
      "name":"Home",
      "id":"94f622c6-47a8-429e-bba4-9a8aedb1c7f3",
      "path":"https://evocate.sharepoint.com/sites/SuperHub/SitePages/Home.aspx"
    },
    {
      "name":"Fund Information",
      "id":"27ee4101-d84a-4b8b-8a86-567477a5e3db",
      "path":"https://www.catholicsuper.com.au/"

    },
    {
      "name":"Departments",
      "id":"649b7713-7381-4fd9-a85d-946fda3e2efd",
      "path":""
    },
    {
      "name":"My Team Site",
      "id":"27ee4101-d84a-4b8b-8a86-567477a5e3db"
    },
    {
      "name":"Self Service",
      "id":"27ee4101-d84a-4b8b-8a86-567477a5e3db"
    },
    {
      "name":"Community",
      "id":"27ee4101-d84a-4b8b-8a86-567477a5e3db"
    },
    {
      "name":"Navigation",
      "id":"4e5093cc-0ddf-4c28-b84b-2cc829c7a42e"
    }
];
  public static getItemByName(headerName: string): IConfiguration {
      return this._headers.filter((headers: IConfiguration) => headers.name === headerName)[0];
    }
  public static getItems(){
    return this._headers;
  }
    
} // class MissionService