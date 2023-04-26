import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

export const SelectComponent = ({ inputValue, handler, options = [], title }) => (
  <InputContainer>
    {title && (<InputTitle>{title}</InputTitle>)}
    <Select onChange={handler} value={inputValue}>
      {options.map(({ name, value }) => <option value={value}>{name}</option>)}
    </Select>
  </InputContainer>
);

SelectComponent.propTypes = {
  inputValue: PropTypes.string,
  options: PropTypes.array,
  handler: PropTypes.func,
  title: PropTypes.string,
};

const InputContainer = styled.div`    
  display: grid;
  gap: 4px;
`;

const InputTitle = styled.div`
  color: hsla(0,0%,10%,.7);  
  font-size: 13px;
`;

const Select = styled.select`
  box-shadow: 0 0 0 1px #e0e0e0, 0 2px 4px 0 rgb(0 0 0 / 7%), 0 1px 1.5px 0 rgb(0 0 0 / 5%);
  background: rgb(255,255,255) !important;
  padding: 8px 32px 8px 12px;
  & option { padding: 0; }
  box-sizing: border-box;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  border: none;
  height: 44px;
  width: 100%;
`;
