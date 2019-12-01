import { ComponentChild, h, render } from "preact";
import {
  IAppMetadata,
  IEntityFieldMetaWithWidgetId,
  IEntityFieldsMetaWithWidgetId,
  IEntityNameMetaWithWidgetId,
  WidgetType
} from "./Interfaces";

import { APP_ID } from "./Config";
import { DatabaseEntityEditor } from "./Components/Entity/DatabaseEntity/Editor";
import { Error } from "./Components/Entity/DatabaseEntity/Error";

async function init() {
  const selectedWidgets: SDK.IWidget[] = await miro.board.selection.get();
  let nameContainer: IEntityNameMetaWithWidgetId | null = null;
  let fieldsContainer: IEntityFieldsMetaWithWidgetId | null = null;
  let fieldContainers: IEntityFieldMetaWithWidgetId[] = [];

  try {
    // Sorting selected widgets by WidgetType and store meta with widgetId
    selectedWidgets.forEach((widget: SDK.IWidget) => {
      const widgetAppMetadata: IAppMetadata = widget.metadata[APP_ID];

      switch (widgetAppMetadata.widgetType) {
        case WidgetType.ENTITY_NAME_CONTAINER:
          nameContainer = Object.assign(widgetAppMetadata.data, {
            widgetId: widget.id
          }) as IEntityNameMetaWithWidgetId;
          break;
        case WidgetType.ENTITY_FIELDS_CONTAINER:
          fieldsContainer = {
            widgetId: widget.id
          } as IEntityFieldsMetaWithWidgetId;
          break;
        case WidgetType.ENTITY_FIELD_CONTINER:
          fieldContainers.push(
            Object.assign(widgetAppMetadata.data, {
              widgetId: widget.id
            }) as IEntityFieldMetaWithWidgetId
          );
          break;
      }
    });

    // Sorting fields by positions
    fieldContainers.sort((a, b) => {
      if (a.position < b.position) return -1;
      if (a.position > b.position) return 1;
      return 0;
    });

    // Render sidebar content
    let renderComponent: ComponentChild;
    if (nameContainer && fieldsContainer) {
      renderComponent = (
        <DatabaseEntityEditor
          nameContainer={nameContainer}
          fieldsContainer={fieldsContainer}
          fieldContainers={fieldContainers}
        />
      );
    } else {
      renderComponent = <Error />;
    }
    const contentEl = document.getElementById("content");
    if (contentEl) render(renderComponent, contentEl);
  } catch (e) {
    // Notify about errors
    const errorMessage = "Error editing database entity";

    console.error(errorMessage, e);
    miro.showErrorNotification(errorMessage);

    miro.board.selection.clear();
  }
}

miro.onReady(init);
