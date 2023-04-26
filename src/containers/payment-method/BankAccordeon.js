/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

import { ReactComponent as TARGOBANKSVG } from '../../assets/svg/banks/targobank.svg';
import { ReactComponent as ArrowDownSVG } from '../../assets/svg/arrow_down.svg';
import { ReactComponent as HYPOSVG } from '../../assets/svg/banks/hypo.svg';
import { ReactComponent as N26SVG } from '../../assets/svg/banks/n26.svg';
import { ReactComponent as DKBSVG } from '../../assets/svg/banks/dkb.svg';
import { ReactComponent as INGSVG } from '../../assets/svg/banks/ing.svg';

import { P_TARGOBANK } from './BankPopups/P_TARGOBANK';
import { P_HYPO } from './BankPopups/P_HYPO';
import { P_N26 } from './BankPopups/P_N26';
import { P_DKB } from './BankPopups/P_DKB';
import { P_ING } from './BankPopups/P_ING';

import { Text } from '../../components';

export const BankAccordeon = ({ handleBankOpen, d2, handleOpenD2, isNotCardType }) => {
  return (
    <Dropdown isOpen={d2} isNotCardType={isNotCardType}>
      {!isNotCardType ? (
        <>
          <div className="left" onClick={handleOpenD2}>
            <Img src="bank.png" />
            <DTitle>
              <Text tid="PAYMENT.METHOD.BANK_ACCOUNT" />
            </DTitle>
          </div>
          <div className="right">
            <ArrowDownSVG viewBox="12 0 24 49" />
          </div>
        </>
      ) : (
        <>
          <div />
          <div />
        </>
      )}
      <BbrBodyBank isOpen={d2}>
        <div>
          <BankCont>
            <P_N26 handleBankOpen={handleBankOpen}>
              <N26SVG className="previewSVG" />
            </P_N26>
            <P_DKB handleBankOpen={handleBankOpen}>
              <DKBSVG className="previewSVG" />
            </P_DKB>
            <P_ING handleBankOpen={handleBankOpen}>
              <INGSVG className="previewSVG" />
            </P_ING>
            <P_HYPO handleBankOpen={handleBankOpen}>
              <HYPOSVG className="previewSVG" />
            </P_HYPO>
            <P_TARGOBANK handleBankOpen={handleBankOpen}>
              <TARGOBANKSVG className="previewSVG targo" />
            </P_TARGOBANK>
          </BankCont>
        </div>
      </BbrBodyBank>
    </Dropdown>
  );
};

BankAccordeon.propTypes = {
  isNotCardType: PropTypes.bool,
  handleOpenD2: PropTypes.func,
  d2: PropTypes.bool,
};

const Img = styled.img`
  width: 24px;
  height: 24px;
`;

const DTitle = styled.p``;

const Dropdown = styled.div`  
  /* margin-bottom: ${(props) => (props.isOpen ? '25px' : '0px')}; */
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.05);
  background-color: white;
  border-radius: 6px;  
  height: 100%;
  width: 100%;

  align-items: center;
  display: flex;

  transition: all 0.3s;

  & .right {
    justify-content: flex-end;
    & svg {
      transition: all 0.3s;
      transform: ${(props) => (props.isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
    }
  }

  & .left,
  .right {
    width: 100%;
    display: flex;
    align-items: center;
    & svg,
    img {
      width: 24px;
      height: 24px;
      margin-bottom: -2px;
      margin-right: 10px;
    }
  }

  padding-left: 25px;
  padding-right: 25px;

  position: relative;

  &:hover {
    cursor: pointer;
  }

  ${props => props.isNotCardType && `
    position: ablolute;
    left: -2000px;
  `}
`;

const BbrBody = styled.div`
  box-shadow: ${(props) => (props.isOpen ? 'none' : '0px 4px 8px 2px rgba(0, 0, 0, 0.1)')};
  background-color: white;    
  transition: all 0.3s;
  border-radius: 12px;  
`;

const BbrBodyBank = styled(BbrBody)`
  transition: all 0.3s;
  position: absolute;
  z-index: 1;

  top: 50px;
  right: 0;
  
  max-height: ${(props) => (props.isOpen ? '0px' : '300px')};  
  overflow: hidden;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BankCont = styled.div`
  grid-template-columns: 1fr 1fr;
  transition: all 0.15s;  
  grid-gap: 6px;
  display: grid;
  padding: 12px;
  width: 380px;

  & .previewSVG {
    box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    transition: 0.3s;    
    padding: 24px;    
    height: auto;
    width: 100%;
    
    max-height: 100px;
    max-width: 150px;

    &:hover {
      box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.15);
      cursor: pointer;
    }
  }

  & > div {
    justify-content: center;
    align-items: center;
    display: flex;
  }

  & > div:last-child {
    grid-column-end: span 2;
  }
`;
