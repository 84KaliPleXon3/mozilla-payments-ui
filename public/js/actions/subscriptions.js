import * as actionTypes from 'constants/action-types';

import * as api from './api';
import * as appActions from './app';
import * as transactionActions from './transaction';

import { gettext, arrayHasSubString } from 'utils';


export function getUserSubscriptions(fetch=api.fetch) {
  return (dispatch, getState) => {

    dispatch({
      type: actionTypes.LOADING_USER_SUBS,
    });

    fetch({
      method: 'get',
      url: '/braintree/subscriptions/',
      context: this,
    }, {
      csrfToken: getState().app.csrfToken,
    }).then(data => {
      console.log('got subscriptions from API:', data);
      dispatch({
        type: actionTypes.GOT_USER_SUBS,
        subscriptions: data.subscriptions,
      });
    }).fail(apiError => {
      console.log('error getting subscriptions:', apiError.responseJSON);
      dispatch(appActions.error('failed to get subscriptions'));
    });

  };
}


export function getSubsByPayMethod(payMethodUri, fetch=api.fetch) {
  // TODO This should be a specific API request
  // see https://github.com/mozilla/payments-service/issues/127
  return (dispatch, getState) => {

    dispatch({
      type: actionTypes.LOADING_SUBS_BY_PAY_METHOD,
    });

    fetch({
      method: 'get',
      url: '/braintree/subscriptions/',
      context: this,
    }, {
      csrfToken: getState().app.csrfToken,
    }).then(data => {
      console.log('got subscriptions from API:', data);
      var filteredSubs = data.subscriptions.filter(
        item => item.paymethod === payMethodUri);
      dispatch({
        type: actionTypes.GOT_SUBS_BY_PAY_METHOD,
        subscriptions: filteredSubs,
        payMethodUri: payMethodUri,
      });
    }).fail(apiError => {
      console.log('error getting filtered subscriptions:',
                  apiError.responseJSON);
      dispatch(appActions.error('failed to get subscriptions by pay method'));
    });

  };
}

export function _createSubscription({dispatch, productId,
                                     getState, payNonce, payMethodUri,
                                     userDefinedAmount, email,
                                     fetch=api.fetch}) {
  var data = {
    plan_id: productId,
  };

  if (userDefinedAmount) {
    console.log('_createSubscription was passed a userDefinedAmount',
                userDefinedAmount);
    data.amount = userDefinedAmount;
  }

  if (email) {
    console.log('_createSubscription was passed an email', email);
    data.email = email;
  }

  data.pay_method_uri = payMethodUri;
  data.pay_method_nonce = payNonce;

  return fetch({
    data: data,
    url: '/braintree/subscriptions/',
    method: 'post',
  }, {
    csrfToken: getState().app.csrfToken,
  }).then(() => {
    console.log('Successfully subscribed + completed payment');
    dispatch(transactionActions.complete({userEmail: email}));
  }).fail($xhr => {
    if ($xhr.status === 400 && $xhr.responseJSON &&
        $xhr.responseJSON.error_response) {
      var allErrors = $xhr.responseJSON.error_response.__all__;
      if (allErrors && arrayHasSubString(allErrors, 'already subscribed')) {
        dispatch(appActions.error('Subscription creation failed', {
          userMessage: gettext('User is already subscribed to this product'),
        }));
      } else if (data.pay_method_nonce) {
        dispatch({
          type: actionTypes.CREDIT_CARD_SUBMISSION_ERRORS,
          apiErrorResult: $xhr.responseJSON,
        });
      }
    } else {
      dispatch(appActions.error('Subscription creation failed'));
    }
  });
}


export function updateSubPayMethod(subscriptionUri, newPayMethodUri,
                                   fetch=api.fetch) {
  var data = {
    new_pay_method_uri: newPayMethodUri,
    subscription_uri: subscriptionUri,
  };

  // Note: The caller is responsible for dispatching based on error/succcess.
  return (dispatch, getState) => {
    return fetch({
      data: data,
      url: '/braintree/subscriptions/paymethod/change/',
      method: 'post',
    }, {
      csrfToken: getState().app.csrfToken,
    }).then(() => {
      console.log('Successfully updated subscription: ' + subscriptionUri +
                  ' to use payMethod: ' + newPayMethodUri);
    }).fail(() => {
      console.error('Failed to update subscription: ' + subscriptionUri +
                    ' to use payMethod: ' + newPayMethodUri);
    });
  };
}
