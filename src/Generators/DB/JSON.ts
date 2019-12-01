import { IDataBaseModel, IDatabaseGenerator } from "../../Interfaces";

export class JSONDatabaseGenerator implements IDatabaseGenerator {
  generate(model: IDataBaseModel): string {
    return JSON.stringify(model, null, 4);
  }
}
