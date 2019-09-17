export default function cacheReducer(state = {}, action) {
  if (action.type === '@@CACHE' && action.payload) {
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
