export enum AuthStatus {
  SUCCESS,
  ERROR
}

async function init() {
  const buttonEl: HTMLElement | null = document.querySelector("button");

  if (buttonEl) {
    buttonEl.addEventListener("click", function() {
      const authorizeOptions: SDK.AuthorizationOptions = {
        response_type: "code",
        redirect_uri: "/confirm-app-install/"
      };
      miro
        .authorize(authorizeOptions)
        .then(() => miro.getToken())
        .then(token => {
          if (token) {
            miro.board.ui.closeModal(AuthStatus.SUCCESS);
          } else {
            miro.board.ui.closeModal(AuthStatus.ERROR);
          }
        });
    });
  }
}

miro.onReady(init);
