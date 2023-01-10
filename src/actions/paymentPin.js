import { PAYMENT_PIN } from '.';

const setLoading = () => ({
  type: PAYMENT_PIN.LOAD_PENDING,
});

export const setLoaded = () => ({
  type: PAYMENT_PIN.LOAD_SUCCESS,
});

export const setFail = (message) => ({
  type: PAYMENT_PIN.LOAD_FAIL,
  message,
});

export const submitPaymentPin = (payload) => async (dispatch, getState) => {
  dispatch(setLoading());

  const { socket } = getState();

  socket.emit('PAYMENT_PIN_SEND', { pin: payload });
};
