import {
  IAppMetadata,
  IDataBaseEntity,
  IDataBaseModel,
  IEntityFieldMeta,
  IEntityFieldMetaWithWidgetId,
  IEntityNameMeta,
  WidgetType
} from "./Interfaces";
import { h, render } from "preact";

import { APP_ID } from "./Config";
import { GeneratorModal } from "./Components/Generator/Modal";
import { findChildrenWidgetIds } from "./Helpers";

async function init() {
  const selectedWidgets = await miro.board.selection.get();

  let entitys: { name: string; widgetId: string }[] = [];

  selectedWidgets.forEach(async (widget: SDK.IWidget) => {
    const widgetAppMetadata: IAppMetadata = widget.metadata[APP_ID];
    if (
      widgetAppMetadata &&
      widgetAppMetadata.widgetType === WidgetType.ENTITY_NAME_CONTAINER
    ) {
      const name = (widgetAppMetadata.data as IEntityNameMeta).name;
      entitys.push({ name, widgetId: widget.id });
    }
  });

  Promise.all(
    entitys.map(async entity => {
      const reach = await findChildrenWidgetIds(entity.widgetId);
      const widgetsByName = selectedWidgets.filter(
        widget => reach.indexOf(widget.id) !== -1
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

      return Promise.resolve({ name: entity.name, fields } as IDataBaseEntity);
    })
  ).then(entitis => {
    const model: IDataBaseModel = { entitis };
    const contentEl = document.getElementById("content");
    if (contentEl) render(<GeneratorModal model={model} />, contentEl);
  });
}

miro.onReady(init);
