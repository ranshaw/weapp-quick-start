export default function appReducer(state = {}, action) {
  if (action.type === 'LAUNCH') {
    return {
      ...state,
      launchOptions: action.payload,
    };
  }
  if (action.type === 'RESTORE') {
    return {};
  }
  return state;
}
