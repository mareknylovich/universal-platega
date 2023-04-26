import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

import { StripeLogoSVG } from '../../assets/svg/stripe_logo';

export const PaymentPriceView = ({ price }) => {
  if (!price) {
    price = 1;
  }

  return (
    <Price>
      <StripeLogoSVG />
      <div style={{ marginTop: '12px' }}>
        <PricePay>Pay</PricePay>
        <div>{`€${Number(price).toFixed(2)}`}</div>
      </div>
      <PriceFooter>
        <span>
          Powered by <StripeLogoSVG />
        </span>
        <span>
          <a>Terms</a>
          <a>Privacy</a>
        </span>
      </PriceFooter>
    </Price>
  );
};

PaymentPriceView.propTypes = {
  price: PropTypes.string,
};

const PriceFooter = styled.div`
  color: hsla(0, 0%, 10%, 0.5) !important;
  justify-content: center;
  margin-top: 12px;
  font-size: 12px;
  opacity: 0.75;
  display: flex;
  width: 100%;

  & a {
    text-decoration: underline dotted hsla(0, 0%, 10%, 0.5) !important;
    color: hsla(0, 0%, 10%, 0.5) !important;
    cursor: pointer;
  }

  & > span {
    align-items: center;
    position: relative;
    display: flex;
  }

  & > span:nth-child(1) {
    padding-right: 16px;
    border-right: 1px solid hsla(0, 0%, 10%, 0.2);
  }

  & > span:nth-child(2) {
    margin-bottom: -2px;
    padding-left: 16px;
    gap: 4px;
  }

  & svg {
    margin-left: 4px;
    height: 14px;
    width: 32px;
  }
`;

const Price = styled.div`
  color: hsla(0, 0%, 10%, 0.9);
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-weight: bold;
  font-size: 36px;
  display: flex;
  height: 100%;

  & > svg:first-child {
    margin-left: 4px;
  }

  @media (min-width: 1050px) {
    height: 490px !important;

    &::before {
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      background: #ffffff;
      content: ' ';
      height: 100%;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 0;
      box-shadow: 15px 0 30px 0 rgb(0 0 0 / 18%);
      -webkit-transform-origin: right;
      -ms-transform-origin: right;
      transform-origin: right;
      width: 50%;
    }
  }
`;

const PricePay = styled.div`
  color: hsla(0, 0%, 10%, 0.6);
  margin-bottom: -6px;
  text-align: center;
  font-size: 16px;
`;
