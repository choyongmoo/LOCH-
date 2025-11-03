import { SpinnerIcon, Toast, useConnectionState } from "@livekit/components-react";
import type { Room } from "livekit-client";
import { ConnectionState } from "livekit-client";
import * as React from "react";

export interface ConnectionStateToastProps extends React.HTMLAttributes<HTMLDivElement> {
  room?: Room;
}

export function ConnectionStateToast(props: ConnectionStateToastProps) {
  const [notification, setNotification] = React.useState<React.ReactElement | undefined>(undefined);
  const state = useConnectionState(props.room);

  React.useEffect(() => {
    switch (state) {
      case ConnectionState.Reconnecting:
        setNotification(
          <>
            <SpinnerIcon className="lk-spinner" /> 재연결 중...
          </>
        );
        break;
      case ConnectionState.Connecting:
        setNotification(
          <>
            <SpinnerIcon className="lk-spinner" /> 연결 중...
          </>
        );
        break;
      case ConnectionState.Disconnected:
        setNotification(<>Disconnected</>);
        break;
      default:
        setNotification(undefined);
        break;
    }
  }, [state]);
  return notification ? <Toast className="lk-toast-connection-state">{notification}</Toast> : <></>;
}
