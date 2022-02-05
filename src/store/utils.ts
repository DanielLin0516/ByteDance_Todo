export function uuid() {
  return Math.random().toString(16).slice(2);
}

export function saveStatePlugins(store: {
  subscribe: (arg0: (mutations: any, state: any) => void) => void;
}) {
  store.subscribe((mutations: any, state: { board: any }) => {
    localStorage.setItem("board", JSON.stringify(state.board));
  });
}
export function getTimeStamp() {
  return Date.parse(new Date().toString());
}
export function timetrans(timestamp: any) {
  var date = new Date(timestamp);
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

export enum PosType {
  first,
  middle,
  end,
}

/**
 * 计算Pos
 * @param before 
 * @param after 
 * @param type 
 * @returns 
 */
export function getPos(before: number, after: number, type: number): number {
  let pos = NaN;
  
  if (type === PosType.end) {
    pos = before + 60000;
  } else if (type === PosType.first) {
    pos = after > 60000 ? 60000 : after / 2;
  } else {

    pos = before + (after - before) / 2;
  }
  return Math.floor(pos * 100) / 100;
}
