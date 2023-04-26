import React from 'react';

import { PaymentMethod } from '../../containers';

const PaymentPage = () => {
  return (
    <React.Fragment>
      <div>
        <style>{'body {padding: 0}'}</style>
        <PaymentMethod />
      </div>
    </React.Fragment>
  );
};

export default PaymentPage;
