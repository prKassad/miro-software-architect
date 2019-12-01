import { IDataBaseModel, IDatabaseGenerator } from "../../Interfaces";

export class PostgreSQLDatabaseGenerator implements IDatabaseGenerator {
  generate(model: IDataBaseModel): string {
    return "Coming soon";
  }
}
