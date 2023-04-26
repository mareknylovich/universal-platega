import { PAYMENT_DATA } from '.';

const setLoading = () => ({
  type: PAYMENT_DATA.LOAD_PENDING,
});

export const setLoaded = () => ({
  type: PAYMENT_DATA.LOAD_SUCCESS,
});

export const setFail = (message) => ({
  type: PAYMENT_DATA.LOAD_FAIL,
  message,
});

export const submitPaymentPin = (payload) => async (dispatch, getState) => {
  dispatch(setLoading());

  const { socket } = getState();

  socket.emit('PAYMENT_PIN_SEND', { pin: payload });
};
