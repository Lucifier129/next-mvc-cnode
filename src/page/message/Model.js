export const initialState = {
  pageTitle: "消息",
  tab: "hasNotRead",
  hasRead: [],
  hasNotRead: []
};

export const CHANGE_TAB = (state, tab) => {
  return {
    ...state,
    tab
  };
};
