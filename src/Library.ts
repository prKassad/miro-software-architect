import {
  genEnitityNameWidget,
  genEnityFieldWidget,
  genEntityFieldsWidget,
  genServiceEdgeWidget
} from "./Helpers";

import { ENTITY_NAME_CONTINER_HEIGHT } from "./Config";

/**
 * Create enitity element
 * @param x
 * @param y
 * @param color
 * @param name
 */
async function createElement(
  x: number,
  y: number,
  color: string,
  name: string
) {
  const createdWidgets: SDK.IWidget[] = await miro.board.widgets.create([
    genEnitityNameWidget({ x, y, color, name }),
    genEntityFieldsWidget({ x, y: y + ENTITY_NAME_CONTINER_HEIGHT }),
    genEnityFieldWidget({ x, y: y + ENTITY_NAME_CONTINER_HEIGHT })
  ]);
  const ids: string[] = createdWidgets.map(w => w.id);
  // Add service eges for widgets
  let serviceEdges: SDK.IWidget[] = [];
  for (let i = 1; i < ids.length; i++) {
    serviceEdges.push(
      genServiceEdgeWidget({ startWidgetId: ids[0], endWidgetId: ids[i] })
    );
  }
  const edgesIds = await miro.board.widgets.create(serviceEdges);
  createdWidgets.shift();
  await miro.board.widgets.sendBackward(createdWidgets);
  await miro.board.widgets.sendBackward(edgesIds);
}

/**
 * Generate preview library element
 * @param color
 */
const getElementPreview = (color: string) =>
  `data:image/svg+xml,%3Csvg width='70' height='100' 
  xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Crect 
  stroke='null' x='35' y='50' fill='%23${color}' 
  height='100' width='70'/%3E%3C/g%3E%3C/svg%3E`;

// Add drag & drop to library elements
function init() {
  const container: HTMLElement | null = document.querySelector("#container");

  let color: string = "#000";
  let text: string = "Unnamed element";
  const options: SDK.DraggableItemsContainerOptions = {
    draggableItemSelector: ".element",
    getDraggableItemPreview: (targetElement: HTMLElement) => {
      color = targetElement.getAttribute("data-color") || "#000";
      text = targetElement.innerText;
      return {
        url: getElementPreview(color)
      };
    },
    onDrop: (x: number, y: number) => {
      createElement(x, y, color, text);
    }
  };
  if (container) miro.board.ui.initDraggableItemsContainer(container, options);
}

miro.onReady(init);
