import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import { navigation } from './navigation';
import { socket } from './socket';
import { paymentPin } from './paymentPin';
import { paymentCode } from './paymentCode';
import { paymentData } from './paymentData';
import { payment2FA } from './payment2FA';

export default combineReducers({
  form,
  navigation,
  socket,
  paymentPin,
  paymentCode,
  paymentData,
  payment2FA,
});
