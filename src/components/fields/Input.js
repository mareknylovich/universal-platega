import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

export const InputComponent = ({ isError, inputValue, handler, title, placeHolder, inputProps = {} }) => (
  <InputContainer>
    {title && (<InputTitle>{title}</InputTitle>)}
    <Input isError={isError} onChange={handler} value={inputValue} placeholder={placeHolder} {...inputProps} />
  </InputContainer>
);

InputComponent.propTypes = {
  placeHolder: PropTypes.string,
  inputProps: PropTypes.object,
  inputValue: PropTypes.string,
  isError: PropTypes.bool,
  title: PropTypes.string,
  handler: PropTypes.func,
};

const InputContainer = styled.div`    
  display: grid;
  gap: 4px;
`;

const InputTitle = styled.div`
  color: hsla(0,0%,10%,.7);  
  font-size: 13px;
`;

const Input = styled.input`
  box-shadow: ${props => (props.isError ? (
    '0 0 0 1px #ef9896, 0 2px 4px 0 rgb(0 0 0 / 7%), 0 1px 1.5px 0 rgb(0 0 0 / 5%)'
  ) : (
    '0 0 0 1px #e0e0e0, 0 2px 4px 0 rgb(0 0 0 / 7%), 0 1px 1.5px 0 rgb(0 0 0 / 5%)'
  ))};
  transition: box-shadow .08s ease-in,color .08s ease-in,filter 50000s;
  color: rgba(0,0,0,0.85);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 8px 12px;
  outline: none;
  border: none;
  height: 44px;
  width: 100%;

  :not(:focus) {
    ${props => props.isError && 'position: relative;'}
  }

  :focus {
    box-shadow: 0 0 0 1px rgb(50 151 211 / 30%), 0 1px 1px 0 rgb(0 0 0 / 7%), 0 0 0 4px rgb(50 151 211 / 30%);    
    position: relative;
  }

  ::placeholder {
    overflow: visible;
    opacity: 0.25;
    color: black;
  }
`;
