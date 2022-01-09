const missingReducer = (state = [], action) => {
  switch (action.type) {
      case 'SET_MISSING':
          return action.payload;
      default:
          return state;
  }
  return state;
}


// user will be on the redux state at:
// state.user
export default missingReducer;