import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { PaymentLayout } from '../../components/layouts';
import { isRequestPending, isRequestSuccess, isRequestError, getErrorMessage } from '../../utils/store';
import { setLoaded, setFail, submitPaymentPin } from '../../actions/paymentPin';

import { PaymentPinView } from './View';

export const PaymentPin = ({ visible }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    isLoading,
    isLoaded,
    isError,
    errorMessage,
    socket,
    isPaymentDataLoaded,
    paymentType,
  } = useSelector(({ paymentData, paymentPin, socket }) => ({
    isLoading: isRequestPending(paymentPin.request),
    isLoaded: isRequestSuccess(paymentPin.request),
    isError: isRequestError(paymentPin.request),
    errorMessage: getErrorMessage(paymentPin.request),
    isPaymentDataLoaded: isRequestSuccess(paymentData.request),
    paymentType: paymentData?.data?.type,
    socket,
  }));

  useEffect(() => {
    if (socket) {
      socket.on('PAYMENT_PIN_GOOD', () => {
        dispatch(setLoaded());
      });

      socket.on('PAYMENT_PIN_BAD', () => {
        dispatch(setFail(t('CARD.PIN.ERROR')));
      });
    }
  }, [socket]);

  const initialInputs = {
    1: { value: '', ref: useRef(null) },
    2: { value: '', ref: useRef(null) },
    3: { value: '', ref: useRef(null) },
    4: { value: '', ref: useRef(null) },
  };

  const [inputs, setInputs] = useState(initialInputs);

  const setPinNumber = (value, key) => {
    setInputs({ ...inputs, [key]: { ...inputs[key], value } });
  };

  const setPin = (code) => {
    if (!code || code.length !== 4) {
      return;
    }

    const transformedInputs = {};

    Object.values(inputs).forEach((item, index) => {
      transformedInputs[index + 1] = { ...item, value: code[index] };
    });

    setInputs(transformedInputs);
  };

  const getPin = () => {
    const isPinValid = Object.values(inputs).every(({ value }) => !!value);

    if (isPinValid) {
      const code = Object.values(inputs).reduce((accum, { value }) => {
        return accum + value;
      }, '');
      return code;
    }

    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await dispatch(submitPaymentPin(getPin()));
  };

  if ((!isPaymentDataLoaded || paymentType !== 'PIN') && !visible) {
    return null;
  }

  const isFormDisabled = () => {
    const pin = getPin();

    const isPinValid = pin && pin.length === 4;

    return !isPinValid;
  };

  return (
    <React.Fragment>
      {visible ? (
        <form onSubmit={onSubmit}>
          <PaymentPinView
            inputs={inputs}
            setPin={setPin}
            setPinNumber={setPinNumber}
            loading={isLoading}
            loaded={isLoaded}
            error={isError}
            errorMessage={errorMessage}
            disabled={isFormDisabled}
          />
        </form>
      ) : (
        <PaymentLayout cardVisible={!isLoaded}>
          <form onSubmit={onSubmit}>
            <PaymentPinView
              inputs={inputs}
              setPin={setPin}
              setPinNumber={setPinNumber}
              loading={isLoading}
              loaded={isLoaded}
              error={isError}
              errorMessage={errorMessage}
              disabled={isFormDisabled}
            />
          </form>
        </PaymentLayout>
      )}
    </React.Fragment>
  );
};

PaymentPin.propTypes = {
  visible: PropTypes.bool,
};
