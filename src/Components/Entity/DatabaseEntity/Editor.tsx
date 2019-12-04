import { APP_ID, EMPTY_CELLS_ON_FIELDS_CONTINER } from "../../../Config";
import { Component, h } from "preact";
import {
  DataBaseFieldType,
  IEntityFieldMetaWithWidgetId,
  IEntityFieldsMetaWithWidgetId,
  IEntityNameMetaWithWidgetId,
  WidgetType
} from "../../../Interfaces";
import {
  genEnityFieldWidget,
  genFieldTextWidget,
  genServiceEdgeWidget
} from "../../../Helpers";

import { Button } from "../../Reusable/Button";
import { DatabaseEntityFieldsContainer } from "./Fields";
import { DatabaseEntityNameContainer } from "./Name";
import { convertStartToCenterCoords } from "./../../../Helpers";

export interface IEditorProps {
  nameContainer: IEntityNameMetaWithWidgetId;
  fieldsContainer: IEntityFieldsMetaWithWidgetId;
  fieldContainers: IEntityFieldMetaWithWidgetId[];
}

export interface IEditorState extends IEditorProps {}

export class DatabaseEntityEditor extends Component<
  IEditorProps,
  IEditorState
> {
  componentDidMount() {
    this.setState(this.props);
  }

  async updateName(name: string) {
    this.setState({
      ...this.state,
      nameContainer: { ...this.state.nameContainer, name }
    });
    await this.rebuild();
    await miro.board.widgets.update({
      id: this.state.nameContainer.widgetId,
      metadata: {
        [APP_ID]: {
          widgetType: WidgetType.ENTITY_NAME_CONTAINER,
          data: {
            name: name
          }
        }
      },
      text: name
    });
  }

  async updateField(
    index: number,
    field: IEntityFieldMetaWithWidgetId
  ): Promise<void> {
    const fields: IEntityFieldMetaWithWidgetId[] = [
      ...this.state.fieldContainers
    ];
    fields[index] = field;
    this.setState({
      ...this.state,
      fieldContainers: fields
    });

    const text = genFieldTextWidget(field);

    await miro.board.widgets.update({
      id: field.widgetId,
      metadata: {
        [APP_ID]: {
          widgetType: WidgetType.ENTITY_FIELD_CONTINER,
          data: field
        }
      },
      text
    });
    this.rebuild();
  }

  async addField(): Promise<void> {
    const { bottom, width, left } = (
      await miro.board.widgets.get({
        id: this.state.fieldsContainer.widgetId
      })
    )[0].bounds;
    const widget: SDK.IWidget[] = await miro.board.widgets.create(
      genEnityFieldWidget({
        x: left,
        y: bottom - 35,
        width: width,
        height: 35,
        position: this.state.fieldContainers.length,
        clientVisible: false,
        name: "newField",
        type: DataBaseFieldType.varchar,
        autoIncrement: false,
        primaryKey: false,
        foreginKey: false,
        notNull: false,
        unique: false
      })
    );
    let newfieldContainers = [...this.state.fieldContainers];
    newfieldContainers.push(
      Object.assign(widget[0].metadata[APP_ID].data, { widgetId: widget[0].id })
    );
    await this.setState({ ...this.state, fieldContainers: newfieldContainers });
    const edge = genServiceEdgeWidget({
      startWidgetId: this.state.nameContainer.widgetId,
      endWidgetId: widget[0].id
    });
    await miro.board.widgets.create(edge);
    const selectionWidgets = (await miro.board.selection.get()).map(w => w.id);
    await miro.board.selection.selectWidgets([
      ...selectionWidgets,
      ...[widget[0].id]
    ]);
    await this.rebuild(false, this.state.fieldContainers.length === 1);
  }

  async removeField(index: number): Promise<void> {
    const wid = this.state.fieldContainers[index].widgetId;
    const fieldContainers: IEntityFieldMetaWithWidgetId[] = [
      ...this.state.fieldContainers
    ].filter((_, ind) => ind !== index);
    await this.setState({ ...this.state, fieldContainers });
    await miro.board.widgets.deleteById(wid);
    await this.rebuild(index === 0);
  }

  async rebuild(
    firstFieldRemoved: boolean = false,
    firstFieldCreated: boolean = false
  ) {
    const fieldsContainer: SDK.IWidget = (
      await miro.board.widgets.get({
        id: this.state.fieldsContainer.widgetId
      })
    )[0];

    let width, height, top, left;
    if (!firstFieldCreated && this.state.fieldContainers.length) {
      const firstField: SDK.IWidget = (
        await miro.board.widgets.get({
          id: this.state.fieldContainers[0].widgetId
        })
      )[0];
      width = firstField.bounds.width;
      height = firstField.bounds.height;
      top = firstFieldRemoved
        ? firstField.bounds.top - height
        : firstField.bounds.top;
      left = firstField.bounds.left;
    } else {
      width = fieldsContainer.bounds.width;
      if (firstFieldCreated) {
        const nameContainer: SDK.IWidget = (
          await miro.board.widgets.get({
            id: this.state.nameContainer.widgetId
          })
        )[0];
        height = nameContainer.bounds.height * 0.8;
      } else if (this.state.fieldContainers.length) {
        const firstField: SDK.IWidget = (
          await miro.board.widgets.get({
            id: this.state.fieldContainers[0].widgetId
          })
        )[0];
        height = firstField.bounds.height;
      }
      top = fieldsContainer.bounds.top;
      left = fieldsContainer.bounds.left;
    }

    if (this.state.fieldContainers.length) {
      await miro.board.widgets.update({
        id: this.state.fieldsContainer.widgetId,
        ...convertStartToCenterCoords(
          fieldsContainer.bounds.left,
          fieldsContainer.bounds.top,
          width,
          height *
            (this.state.fieldContainers.length + EMPTY_CELLS_ON_FIELDS_CONTINER)
        )
      });

      this.state.fieldContainers.forEach(async (field, index) => {
        miro.board.widgets.update({
          id: field.widgetId,
          ...convertStartToCenterCoords(
            left,
            top + index * height,
            width,
            height
          ),
          clientVisible: true,
          metadata: {
            [APP_ID]: {
              widgetType: WidgetType.ENTITY_FIELD_CONTINER,
              data: field
            }
          }
        });
      });
    }
  }

  render() {
    if (this.state.nameContainer)
      return (
        <div>
          <div
            style={{
              color: "#333"
            }}
          >
            You can edit this entity.
          </div>
          <DatabaseEntityNameContainer
            nameContainer={this.state.nameContainer}
            onNameUpdated={this.updateName.bind(this)}
          ></DatabaseEntityNameContainer>
          <DatabaseEntityFieldsContainer
            fieldsContainer={this.state.fieldsContainer}
            fieldContainers={this.state.fieldContainers}
            onFieldUpdated={this.updateField.bind(this)}
            onFieldRemoved={this.removeField.bind(this)}
          ></DatabaseEntityFieldsContainer>
          <div style={{ margin: "14px 0" }}>
            <Button onClick={this.addField.bind(this)}>Add field</Button>
          </div>
        </div>
      );
  }
}
