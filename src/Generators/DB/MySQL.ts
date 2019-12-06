import {
  DataBaseFieldType,
  IDataBaseModel,
  IDatabaseGenerator
} from "../../Interfaces";

export class MySQLDatabaseGenerator implements IDatabaseGenerator {
  generate(model: IDataBaseModel): string {
    return (
      "# for the purpose of example generators only\n\n" +
      model.entities
        .map(entity => {
          const fields = entity.fields.map(field => {
            const flags: string[] = [];
            if (field.defaultValue && field.defaultValue !== "")
              flags.push(`DEFAULT '${field.defaultValue}'`);
            if (field.notNull) flags.push("NOT NULL");
            if (field.autoIncrement) flags.push("AUTO_INCREMENT");
            if (field.primaryKey) flags.push("PRIMARY KEY");
            const sep: string = flags.length ? " " : "";

            const length: string = field.length ? `(${field.length})` : "";

            return `  \`${field.name}\` ${
              DataBaseFieldType[field.type]
            }${length}${sep}${flags.join(" ")},`;
          });

          return `CREATE TABLE \`${entity.name}\` (\n${fields.join(
            "\n"
          )}\n)  ENGINE=INNODB;`;
        })
        .join("\n\n")
    );
  }
}
