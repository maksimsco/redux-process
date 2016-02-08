export const MESSAGE_SHOW = 'MESSAGE_SHOW';
export const MESSAGE_HIDE = 'MESSAGE_HIDE';


const initial = false;

export default function reducer(state=initial, action) {
  switch (action.type) {
    case MESSAGE_SHOW:
      return true;
    case MESSAGE_HIDE:
      return false;
    default:
      return state;
  }
}

export function show() {
  return {
    type: MESSAGE_SHOW
  };
}

export function hide() {
  return {
    type: MESSAGE_HIDE
  };
}
