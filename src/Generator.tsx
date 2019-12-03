import {
  IAppMetadata,
  IDataBaseEntity,
  IDataBaseModel,
  IEntityFieldMetaWithWidgetId,
  IEntityNameMeta,
  WidgetType
} from "./Interfaces";
import { h, render } from "preact";

import { APP_ID } from "./Config";
import { GeneratorModal } from "./Components/Generator/Modal";
import { findChildrenWidgetIds } from "./Helpers";

/**
 * Initializе Sidebar
 */
async function init() {
  const selectedWidgets = await miro.board.selection.get();

  let entities: IDataBaseEntity[] = [];

  // Find entities name and widgetId without fields
  selectedWidgets.forEach(async (widget: SDK.IWidget) => {
    const widgetAppMetadata: IAppMetadata = widget.metadata[APP_ID];
    if (
      widgetAppMetadata &&
      widgetAppMetadata.widgetType === WidgetType.ENTITY_NAME_CONTAINER
    ) {
      const name = (widgetAppMetadata.data as IEntityNameMeta).name;
      entities.push({ name, widgetId: widget.id, fields: [] });
    }
  });

  // Find fields for entities
  entities = await Promise.all(
    entities.map(async entity => {
      const reachableIds = await findChildrenWidgetIds(entity.widgetId);
      const widgetsByName = selectedWidgets.filter(
        widget => reachableIds.indexOf(widget.id) !== -1
      );
      const fields = widgetsByName
        .map(widget => {
          if (
            widget.metadata[APP_ID] &&
            widget.metadata[APP_ID].widgetType ===
              WidgetType.ENTITY_FIELD_CONTINER
          ) {
            return Object.assign(widget.metadata[APP_ID].data, {
              widgetId: widget.id
            }) as IEntityFieldMetaWithWidgetId;
            return;
          }
        })
        .filter(field => field !== undefined);

      return Promise.resolve({ ...entity, fields } as IDataBaseEntity);
    })
  );

  // Final model
  const model: IDataBaseModel = { entities };

  // Rendel modal windows
  const contentEl = document.getElementById("content");
  if (contentEl) render(<GeneratorModal model={model} />, contentEl);
}

miro.onReady(init);
