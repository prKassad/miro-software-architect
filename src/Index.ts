import {
  APP_ICON,
  APP_ID,
  APP_TITLE,
  GENERATE_CODE_ICON,
  GENERATOR_PATH,
  LIBRARY_PATH,
  NOT_AUTHORIZED_PATH,
  SIDEBAR_PATH
} from "./Config";

import { AuthStatus } from "./NotAuthorized";
import { findReachableWidgetIds } from "./Helpers";

// Init plugin
async function init() {
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: APP_TITLE,
        svgIcon: APP_ICON,
        onClick: async () => {
          const authorized = await miro.isAuthorized();
          if (authorized) {
            miro.board.ui.openLibrary(LIBRARY_PATH, { title: APP_TITLE });
          } else {
            openAuthModal();
          }
        }
      },
      getWidgetMenuItems: widgets => {
        return Promise.resolve([
          {
            tooltip: "Generate code",
            svgIcon: GENERATE_CODE_ICON,
            onClick: async widgets => {
              await miro.board.ui.openModal(GENERATOR_PATH);
            }
          }
        ]);
      }
    }
  });
  const authorized = await miro.isAuthorized();
  if (authorized) {
    runApp();
  }
}

function openAuthModal() {
  miro.board.ui
    .openModal(NOT_AUTHORIZED_PATH, {
      width: 410,
      height: 220
    })
    .then(status => {
      switch (status) {
        case AuthStatus.SUCCESS:
          runApp();
          break;
        case AuthStatus.ERROR:
          const errorMessage = "Application is not authorized";
          miro.showErrorNotification(errorMessage);
          break;
      }
    });
}

async function runApp() {
  // Open sidebar when widget with app metadata selected
  miro.addListener("SELECTION_UPDATED", async () => {
    const widgets: SDK.IWidget[] = await miro.board.selection.get();
    if (widgets.length === 1) {
      const currentWidget = widgets[0];
      if (currentWidget.metadata[APP_ID]) {
        // Find all reachable widgets (include current) with WidgetType = SERVICE_EDGE
        let startWidgetId: string;
        if (currentWidget.type === "LINE") {
          startWidgetId =
            (currentWidget as SDK.ILineWidget).endWidgetId || currentWidget.id;
        } else {
          startWidgetId = currentWidget.id;
        }
        const reachableIds = await findReachableWidgetIds(startWidgetId, true);
        if (reachableIds.length > 1) {
          // Select all reachable widgets and open sidebar
          await miro.board.selection.selectWidgets(reachableIds);
          setTimeout(async () => {
            // run in next EL tick, for smooth sidebar animation
            await miro.board.ui.openLeftSidebar(SIDEBAR_PATH);
          });
        } else {
          // Reachable only current selection widgets, close sidebar
          await miro.board.ui.closeLeftSidebar();
        }
      } else {
        // Selected widget is not created by this app, close sidebar
        await miro.board.ui.closeLeftSidebar();
      }
    } else if (widgets.length === 0) {
      // Widgets is not selected, close sidebar
      await miro.board.ui.closeLeftSidebar();
    }
  });
}

miro.onReady(init);
