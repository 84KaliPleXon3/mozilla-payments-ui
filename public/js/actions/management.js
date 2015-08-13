import * as actionTypes from 'constants/action-types';


export function error(debugMessage) {
  return {
    type: actionTypes.APP_ERROR,
    error: {debugMessage: debugMessage},
  };
}

export function showMyAccount() {
  return {
    type: actionTypes.SHOW_MY_ACCOUNT,
  };
}

export function showSignIn() {
  return {
    type: actionTypes.SHOW_SIGN_IN,
  };
}

export function showSignOut() {
  return {
    type: actionTypes.SHOW_SIGN_OUT,
  };
}

export function showPayMethods() {
  return {
    type: actionTypes.SHOW_PAY_METHODS,
  };
}

export function showAddPayMethod() {
  return {
    type: actionTypes.SHOW_ADD_PAY_METHOD,
  };
}

export function showDelPayMethod() {
  return {
    type: actionTypes.SHOW_DEL_PAY_METHOD,
  };
}

export function showHistory() {
  return {
    type: actionTypes.SHOW_HISTORY,
  };
}

export function showSubscriptions() {
  return {
    type: actionTypes.SHOW_SUBSCRIPTIONS,
  };
}

export function closeModal() {
  return {
    type: actionTypes.CLOSE_MODAL,
  };
}
