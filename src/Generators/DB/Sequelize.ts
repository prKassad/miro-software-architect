import { IDataBaseModel, IDatabaseGenerator } from "../../Interfaces";

export class SequelizeDatabaseGenerator implements IDatabaseGenerator {
  generate(model: IDataBaseModel): string {
    return "Coming soon";
  }
}
