import React, { Component, PropTypes } from 'react';
import SubscriptionList from 'components/subscription-list';

import { gettext, setTitle } from 'utils';


export default class Subscriptions extends Component {

  static propTypes = {
    getUserSubscriptions: PropTypes.func.isRequired,
    payMethods: PropTypes.array.isRequired,
    userSubscriptions: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.props.getUserSubscriptions();
    setTitle(gettext('Subscriptions'));
  }

  render() {

    return (
      <div className="subscriptions">
        <h1>{gettext('Subscriptions')}</h1>
        <SubscriptionList
          payMethods={this.props.payMethods}
          subscriptions={this.props.userSubscriptions}
        />
      </div>
    );
  }
}
