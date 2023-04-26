import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import FavoriteIcon from '@material-ui/icons/Favorite';

import { PinInput, Progress, Text } from '../../components';
import { redirect } from '../../utils/navigation';
import { ROUTES } from '../../constants/routes';

export const PaymentPinView = ({
  inputs,
  setPin,
  setPinNumber,
  loading,
  loaded,
  error,
  errorMessage,
  disabled,
}) => {
  const getRef = (key) => {
    return inputs[key].ref;
  };

  return (
    <React.Fragment>
      {!loading && !loaded && (
        <React.Fragment>
          <h3 style={{ marginBottom: '6px', padding: 0, textAlign: 'center' }}>
            <Text tid="CARD.PIN.TITLE" />
          </h3>
          <div className="card-input">
            <label
              htmlFor="cardCode"
              className="card-input__label"
              style={{ textAlign: 'center', marginBottom: '12px !important' }}
            >
              <Text tid="CARD.PIN.LABEL" />
            </label>
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
                      ? { borderRadius: ' 6px 0px 0px 6px !important' }
                      : index === 5
                      ? { borderRadius: ' 0px 6px 6px 0px !important' }
                      : {}
                  }
                />
              ))}
            </InputsContainer>
          </div>

          <button type="submit" disabled={disabled} className="cta cta-full-width">
            <Text tid="CARD.PIN.BUTTON" />
          </button>
          {error && (
            <span className="error" style={{ marginTop: '10px' }}>
              {errorMessage}
            </span>
          )}
        </React.Fragment>
      )}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Progress size={70} />
          <h3 style={{ marginTop: '24px', padding: 0 }}>
            <Text tid="CARD.LOADING" />
          </h3>
        </div>
      )}
      {loaded && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FavoriteIcon style={{ color: 'rgb(229, 9, 127)', fontSize: '8rem' }} />
          <h3 style={{ margin: '24px 0 30px', padding: 0, lineHeight: 1.2, textAlign: 'center' }}>
            <Text tid="CARD.SUCCESS" />
          </h3>
          <button type="button" className="cta cta-full-width" onClick={() => redirect(ROUTES.HOME)}>
            <Text tid="CARD.HOME_BUTTON" />
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

const InputsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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

PaymentPinView.propTypes = {
  inputs: PropTypes.array,
  setPin: PropTypes.func,
  setPinNumber: PropTypes.number,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
};
