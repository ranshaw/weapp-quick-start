const initialState = {
  userInfo: null,
  token: null,
  expireTime: null,
};
export default function authReducer(state = initialState, action) {
  if (action.type === 'SET_USER_INFO') {
    return {
      ...state,
      userInfo: action.payload,
    };
  }
  if (action.type === 'SET_AUTHORIZATION_TOKEN') {
    return {
      ...state,
      token: action.payload,
      expireTime: new Date(new Date().valueOf() + 3600000 * 24 * 30),
    };
  }
  if (action.type === 'RESTORE') {
    return initialState;
  }
  return state;
}
