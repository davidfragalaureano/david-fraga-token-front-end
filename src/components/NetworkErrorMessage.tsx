import React from "react";

type OnClickEvent = React.MouseEventHandler<HTMLButtonElement>;

export function NetworkErrorMessage(
  { message, dismiss } : { message: string, dismiss: OnClickEvent }
) {
  return (
    <div className="alert alert-danger" role="alert">
      {message}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={dismiss}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}