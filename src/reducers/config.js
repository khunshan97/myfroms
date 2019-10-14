const initialState = {
  localDev: false,
  serverUrl:
    process.env.NODE_ENV == "development"
      ? "http://127.0.0.1:8000"
      : "https://wtbe-249306.appspot.com"
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
