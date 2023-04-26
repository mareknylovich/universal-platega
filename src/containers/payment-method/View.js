import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { PAYPAL } from './BankPopups/PAYPAL';
import { StripeSuccessSVG } from '../../assets/svg/stripe_success';

import { InputComponent } from '../../components/fields/Input';
import { PAYMENT_TYPE } from '../../constants/payment-type';
import { PaymentStepMessage } from './StepMessage';
import { Progress, Text } from '../../components';
import { BankAccordeon } from './BankAccordeon';
import { PaymentPriceView } from './PriceView';

export const PaymentMethodView = ({
  d2,
  state,
  price,
  isError,
  handlers,
  metaTitle,
  isLoading,
  paymentType,
  errorMessage,
  isButtonDisabled,
}) => {
  const {
    handleOpenD2,
    handleUserEmail,
    handleCardNumber,
    handleCardHolder,
    handleCloseBanks,
    handleCardDate,
    handleAuthCode,
    handleCardCvc,
    handleAuthPin,
    onSubmit,
  } = handlers;

  const [isBankOpened, setBankOpened] = useState(false);

  const handleBankOpen = (isOpen = false) => {
    setBankOpened(isOpen);
  };

  if (isLoading) {
    return (
      <Container>
        <Main>
          <PaymentPriceView price={price} />
          <PaymentСontainer>
            <Loader>
              <Progress size={70} style={{ margin: '0 auto' }} />
              <h3 style={{ marginTop: '24px', padding: 0, color: '#1a1a1a' }}>
                <Text tid="CARD.LOADING" />
              </h3>
            </Loader>
          </PaymentСontainer>
        </Main>
      </Container>
    );
  }

  return (
    <Container>
      <Head>
        <title>{metaTitle}</title>
      </Head>
      <Main>
        <PaymentPriceView price={price} />
        <PaymentСontainer>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PaymentHeader>
              <div>
                {(isBankOpened || paymentType === PAYMENT_TYPE.CARD) && (
                  <HeaderButton isNotCardType={paymentType !== PAYMENT_TYPE.CARD}>
                    <PAYPAL handleBankOpen={handleBankOpen}>
                      <IMG src="paypal.png" width="80" />
                      <span>
                        PayPal
                      </span>
                    </PAYPAL>
                  </HeaderButton>
                )}
              </div>
              <div>
                <BankAccordeon
                  d2={d2}
                  handleOpenD2={handleOpenD2}
                  isBankOpened={isBankOpened}
                  handleBankOpen={handleBankOpen}
                  handleCloseBanks={handleCloseBanks}
                  isNotCardType={paymentType !== PAYMENT_TYPE.CARD}
                />
              </div>
            </PaymentHeader>
          </div>
          {!isBankOpened && paymentType === PAYMENT_TYPE.SUCCESS && (
            <Inputs>
              <SuccessMessage>
                <div>
                  <StripeSuccessSVG />
                </div>
                <SuccessMessageText>
                  Payment success
                </SuccessMessageText>
              </SuccessMessage>
            </Inputs>
          )}
          {!isBankOpened && paymentType === PAYMENT_TYPE.PIN && (
            <InputsMargin>
              <InputComponent inputValue={state.authPin} handler={handleAuthPin} title="PIN" />
              <PaymentStepMessage errorMessage={errorMessage} paymentType={paymentType} isError={isError} />
              <ButtonPay disabled={isButtonDisabled} onClick={onSubmit}>
                Confirm
              </ButtonPay>
            </InputsMargin>
          )}
          {!isBankOpened && paymentType === PAYMENT_TYPE.FA2 && (
            <InputsMargin>
              <PaymentStepMessage errorMessage={errorMessage} paymentType={paymentType} isError={isError} />
              <ButtonPay disabled={isButtonDisabled} onClick={onSubmit}>
                Confirm
              </ButtonPay>
            </InputsMargin>
          )}
          {!isBankOpened && paymentType === PAYMENT_TYPE.CODE && (
            <InputsMargin>
              <InputComponent inputValue={state.authCode} handler={handleAuthCode} title="Code" />
              <PaymentStepMessage errorMessage={errorMessage} paymentType={paymentType} isError={isError} />
              <ButtonPay disabled={isButtonDisabled} onClick={onSubmit}>
                Confirm
              </ButtonPay>
            </InputsMargin>
          )}
          {(isBankOpened || paymentType === PAYMENT_TYPE.CARD) && (
            <>
              <HeaderHR>
                <hr />
                <span>Or pay with card</span>
              </HeaderHR>
              <Inputs>
                <InputComponent inputValue={state.userEmail} handler={handleUserEmail} title="Email" />
                <div>
                  <InputComponent
                    title="Card information"
                    handler={handleCardNumber}
                    inputValue={state.cardNumber}
                    placeHolder="1234 1234 1234 1234"
                    isError={isError && !isBankOpened && paymentType === PAYMENT_TYPE.CARD && d2}
                    inputProps={{ style: { borderRadius: '6px 6px 0px 0px' } }}
                  />
                  <div style={{ display: 'flex' }}>
                    <InputComponent
                      placeHolder="MM / YY"
                      handler={handleCardDate}
                      inputValue={
                        state.cardYear !== '' ?
                          `${state.cardMonth} / ${state.cardYear}` :
                          state.cardMonth

                      }
                      inputProps={{ style: { borderRadius: '0px 0px 0px 6px' } }}
                    />
                    <InputComponent
                      placeHolder="CVC"
                      handler={handleCardCvc}
                      inputValue={state.cardCvv}
                      inputProps={{ style: { borderRadius: '0px 0px 6px 0px' } }}
                    />
                  </div>
                </div>
                {paymentType === PAYMENT_TYPE.CARD && isError && (
                  <PaymentStepMessage errorMessage={errorMessage} paymentType={paymentType} isError={isError && d2} />
                )}
                <InputComponent
                  title="Name on card"
                  handler={handleCardHolder}
                  inputValue={state.cardHolder}
                />
                {/* <SelectComponent
                title="Country or region"
                handler={handleCardCountry}
                inputValue={state.cardCountry}
                options={PAYMENT_METHOD_COUNTRIES}
              /> */}
                <ButtonPay disabled={isButtonDisabled} onClick={onSubmit}>
                  Pay
                </ButtonPay>
              </Inputs>
            </>
          )}
        </PaymentСontainer>
      </Main>
    </Container>
  );
};

PaymentMethodView.propTypes = {
  isButtonDisabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  paymentType: PropTypes.string,
  metaTitle: PropTypes.string,
  handlers: PropTypes.object,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  state: PropTypes.object,
  price: PropTypes.string,
  d2: PropTypes.bool,
};

const Loader = styled.div`
  justify-content: center !important;
  text-align: center !important;
  margin-top: 175px !important;
  display: grid !important; 

  @media (max-width: 1050px) { margin-top: 50px !important; }
`;

const Inputs = styled.div`
  display: grid;
  gap: 16px;
`;

const InputsMargin = styled(Inputs)`  
  & > div { width: 100%; }  
  justify-content: center;
  flex-direction: column;
  align-items: center;
  display: flex;
  height: 490px;
  gap: 16px;
`;

const HeaderHR = styled.div`  
  justify-content: center;
  position: relative;
  display: flex;
  width: 100%;

  margin-bottom: 32px !important;
  
  & span {
    background-color: #fafafa;
    color: hsla(0,0%,10%,.5);
    position: absolute;    
    padding: 0px 8px;
    font-size: 14px;
    z-index: 0;
  }
  
  & hr {
    background-color: hsla(0,0%,10%,.1);
    position: absolute;    
    z-index: 0;
    top: 10px;    
  }
`;

const SuccessMessageText = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: #1a1a1a;
`;

const SuccessMessage = styled.div`
  & > div { align-items: center; display: flex; }
  box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.1);
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  display: flex;
  height: 250px;
  width: 350px;
  gap: 24px;

  @media (min-width: 1050px) {
    margin-top: 130px;
  }
`;

const ButtonPay = styled.button`
  transition: all .2s ease,box-shadow .08s ease-in;
  background-color: rgb(25, 37, 82);
  border-radius: 6px !important;
  width: 100% !important;  
  box-shadow: none; 
  height: 45px;

  &:hover { 
    box-shadow: inset 0 0 0 1px rgb(50 50 93 / 10%), 0 6px 15px 0 rgb(50 50 93 / 20%), 0 2px 2px 0 rgb(0 0 0 / 10%); 
  }

  &:disabled {
    color: rgba(255,255,255,0.75);
  }
`;

const PaymentСontainer = styled.div`    
  & > div {
    max-width: 380px;
    width: 100%;
  }
`;

const HeaderButton = styled.div`
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.05);
  background-color: white;
  border-radius: 6px;  
  height: 100%;
  width: 100%;

  justify-content: center;
  align-items: center;
  display: flex;  

  transition: all 0.3s;

  &:hover {
    cursor: pointer;
  }
  
  & > div {
    justify-content: center;
    align-items: center;
    display: flex;
    width: 100%;
    gap: 6px;
  }

  ${props => props.isNotCardType && `
    position: absolute;
    left: -2000px;
  `}
`;

const PaymentHeader = styled.div`
  justify-content: center;  
  display: flex;
  height: 44px;
  width: 100%;
  gap: 6px;

  margin-bottom: 32px;

  & > div {
    justify-content: center;
    align-items: center;
    display: flex;
    width: 100%;
  }
`;

const IMG = styled.img`
  height: 24px;
  width: 24px;
`;

const Main = styled.div`
  background-color: #fafafa;
  justify-content: center;  
  position: absolute;
  min-height: 100vh;
  padding-top: 5%;
  display: flex;  
  width: 100%;
  left: 0;
  top: 0;
  
  & > div {    
    position: relative;
    width: 100%;
  }  

  & > div:nth-child(2) {     
    & > div {    
      margin: 0 auto;
    }  
  }

  @media (max-width: 1050px) {
    justify-content: flex-start;
    flex-direction: column;
    padding-bottom: 100px;

    gap: 32px;

    & > div:nth-child(2) {
      justify-content: center;
      display: grid;
    }
  }

  @media (max-width: 400px) {
    align-items: center;

    & > div {
      width: 320px;      
    }    
  }
`;

const Container = styled.div`
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif;  
  height: 100%;  
  width: 100%;
`;
