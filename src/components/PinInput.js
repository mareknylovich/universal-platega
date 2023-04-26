import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

export const PinInput = ({ inputRef, getRef, style, valuee, keyy, setNumber, setCode }) => {
  const onPaste = (e) => {
    const clipboardData = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
    const code = clipboardData.getData('text').slice(0, 4);

    setCode(code);
  };
  return (
    <TextFieldContainer>
      <TextFieldStyled
        value={valuee.value}
        ref={inputRef}
        active={!!valuee.value}
        onPaste={onPaste}
        onChange={(e) => {
          if (e.target.value.length > 1) {
            return null;
          }

          if (e.target.value === '') {
            setNumber(null, keyy);
          } else {
            setNumber(
              e.target.value
                .trim()
                .split('')
                .pop(),
              keyy,
            );
          }

          if (keyy === '4') {
            return null;
          }
          const refNext = getRef((parseInt(keyy) + 1).toString());

          if (e.target.value) {
            refNext.current.focus();
          }
        }}
        type="password"
        style={style}
        placeholder=""
      />
    </TextFieldContainer>
  );
};

PinInput.propTypes = {
  style: PropTypes.object,
  keyy: PropTypes.string,
  setNumber: PropTypes.func,
  getRef: PropTypes.func,
  valuee: PropTypes.object,
  inputRef: PropTypes.object,
  setCode: PropTypes.func,
};

const TextFieldContainer = styled.div`
  & > .white-color {
    color: red !important ;
  }
`;

const TextFieldStyled = styled.input`
  && {
    width: 66px !important;
    border: 1px solid black;
    transition: 0.3s;
    font-weight: 700;

    border-radius: ${({ style }) => style.borderRadius};
    & > div {
      border-radius: 0;
    }

    & > div > div > fieldset {
      border: none;
    }

    color: black;
    text-align: center;
    font-size: 26px;
    padding: 0 !important;
    height: 44px;

    @media all and (max-width: 650px) {
      width: 44px !important;

      height: 36px;
    }

    @media all and (max-width: 400px) {
      width: 40px !important;

      height: 32px;
    }
  }
`;
