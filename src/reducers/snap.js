export default function snapReducer(state = {}, action) {
  if (action.type === '@@SNAP' && action.payload) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === 'RESTORE') {
    return {};
  }
  return state;
}
