import { useState } from 'react';

export const AppRenderer = ({ app }: { app: string }) => {
  switch (app) {
    case "P":
      return <div>프레젠테이션 앱 화면</div>;
    case "S":
      return <div>스프레드시트 앱 화면</div>;
    case "N":
      return <div>노트 앱 화면</div>;
    case "C":
      return <div>코드 앱 화면</div>;
    default:
      return <div>알 수 없는 앱</div>;
  }
};
