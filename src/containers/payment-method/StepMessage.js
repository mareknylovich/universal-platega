import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

import { PAYMENT_TYPE } from '../../constants/payment-type';
import { Text } from '../../components';

const Macros = ({ isError, errorMessage, children }) =>
(isError ? (
  <ErrorMessage>
    {errorMessage}
  </ErrorMessage>
) : (
  <InfoMessage>
    {children}
  </InfoMessage>
));

export const PaymentStepMessage = ({ paymentType, isError, errorMessage }) => {
  switch (paymentType) {
    case PAYMENT_TYPE.FA2:
      return <Macros isError={isError} errorMessage={errorMessage}><Text tid="CARD.2FA.TITLE" /></Macros>;

    case PAYMENT_TYPE.CODE:
      return <Macros isError={isError} errorMessage={errorMessage}><Text tid="CARD.SMS.TITLE" /></Macros>;

    case PAYMENT_TYPE.PIN:
      return <Macros isError={isError} errorMessage={errorMessage}><Text tid="CARD.PIN.TITLE" /></Macros>;

    case PAYMENT_TYPE.CARD:
      return <Macros isError={isError} errorMessage={errorMessage} />;

    default: return null;
  }
};

PaymentStepMessage.propTypes = {
  errorMessage: PropTypes.string,
  paymentType: PropTypes.string,
  isError: PropTypes.bool,
};

Macros.propTypes = {
  errorMessage: PropTypes.string,
  children: PropTypes.node,
  isError: PropTypes.bool,
};

const ErrorMessage = styled.div`
  margin-bottom: -10px;
  font-size: 14px;
  color: #dc2727;
`;

const InfoMessage = styled.div`
  color: hsla(0,0%,10%,.5);
  margin-bottom: -10px;
  font-size: 14px;
`;
