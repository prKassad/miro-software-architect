import { Component, Fragment, h } from "preact";
import { IDataBaseModel, IDatabaseGenerator } from "../../Interfaces";

import { HibernateDatabaseGenerator } from "../../Generators/DB/Hibernate";
import { JSONDatabaseGenerator } from "../../Generators/DB/JSON";
import { MySQLDatabaseGenerator } from "../../Generators/DB/MySQL";
import { PostgreSQLDatabaseGenerator } from "../../Generators/DB/PostgreSQL";
import { Selector } from "../Reusable/Selector";
import { SequelizeDatabaseGenerator } from "../../Generators/DB/Sequelize";
import { SpringDatabaseGenerator } from "../../Generators/DB/Spring";
import { Textarea } from "../Reusable/Textarea";
import { TypeormDatabaseGenerator } from "../../Generators/DB/Typeorm";

interface ITpye {
  text: string;
  value: number;
  generator: IDatabaseGenerator;
}

const types: ITpye[] = [
  {
    text: "JSON",
    value: 0,
    generator: new JSONDatabaseGenerator()
  },
  {
    text: "MySQL (DDL)",
    value: 1,
    generator: new MySQLDatabaseGenerator()
  },
  {
    text: "PostgreSQL (DDL)",
    value: 2,
    generator: new PostgreSQLDatabaseGenerator()
  },
  {
    text: "Hibernate (Java)",
    value: 3,
    generator: new HibernateDatabaseGenerator()
  },
  {
    text: "Spring (Java)",
    value: 4,
    generator: new SpringDatabaseGenerator()
  },
  {
    text: "Sequelize (Node.js)",
    value: 5,
    generator: new SequelizeDatabaseGenerator()
  },
  {
    text: "Typeorm (Node.js)",
    value: 6,
    generator: new TypeormDatabaseGenerator()
  }
];

export interface IGeneratorModalProps {
  model: IDataBaseModel;
}

export interface IGeneratorModalState {
  type: number;
  code: string;
}

export class GeneratorModal extends Component<
  IGeneratorModalProps,
  IGeneratorModalState
> {
  state = { type: 0, code: "" };

  componentDidMount() {
    this.generateCode();
  }

  async generateCode() {
    const generator: IDatabaseGenerator = types[this.state.type].generator;
    const code = generator.generate(this.props.model);
    this.setState({ ...this.state, code });
  }

  async handleChangeType(e) {
    const typeId = e.currentTarget.value;
    await this.setState({ ...this.state, type: typeId });
    await this.generateCode();
  }

  render() {
    return (
      <Fragment>
        <Selector
          label="Type"
          value={this.state.type}
          onChange={this.handleChangeType.bind(this)}
          options={types}
        />
        <Textarea
          label="Code"
          text={this.state.code}
          onChange={() => {}}
          height={410}
        />
      </Fragment>
    );
  }
}
