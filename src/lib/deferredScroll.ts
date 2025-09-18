// 홈으로 이동한 뒤 특정 섹션으로 스크롤하기 위한 임시 저장소
export function requestScrollTo(id: string) {
  (window as any).__scrollTo = id;
}

export function consumeScrollRequest(): string | null {
  const w = window as any;
  const id = w.__scrollTo ?? null;
  if (id) delete w.__scrollTo; 
  return id;
}