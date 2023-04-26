import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Progress, Text } from '../../components';

const currentYear = new Date().getFullYear();
const monthsArr = Array.from({ length: 12 }, (x, i) => {
  const month = i + 1;
  return month <= 9 ? '0' + month : month;
});
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i);

export const PaymentDataView = ({
  cardMonth,
  cardYear,
  cardCvv,
  cardHolder,
  onUpdateState,
  cardNumberRef,
  cardHolderRef,
  cardDateRef,
  cardCvvRef,
  onCardInputFocus,
  onCardInputBlur,
  formDisabled,
  onSubmit,
  loading,
  error,
  errorMessage,
}) => {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    onUpdateState(name, value);
  };

  const cardYearTitle = t('CARD.DATA.CARD_YEAR');
  const cardMonthTitle = t('CARD.DATA.CARD_MONTH');

  // TODO: We can improve the regex check with a better approach like in the card component.
  const onCardNumberChange = (event) => {
    let { value, name } = event.target;
    let cardNumber = value;
    value = value.replace(/\D/g, '');
    if (/^3[47]\d{0,13}$/.test(value)) {
      cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
    } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
      // diner's club, 14 digits
      cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
    } else if (/^\d{0,16}$/.test(value)) {
      // regular cc number, 16 digits
      cardNumber = value
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
        .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
    }

    setCardNumber(cardNumber.trimRight());
    onUpdateState(name, cardNumber);
  };

  const onCvvFocus = () => {
    onUpdateState('isCardFlipped', true);
  };

  const onCvvBlur = () => {
    onUpdateState('isCardFlipped', false);
  };

  return (
    <React.Fragment>
      {!loading && (
        <form className="" onSubmit={onSubmit}>
          <div className="card-input">
            <label htmlFor="cardNumber" className="card-input__label">
              <Text tid="CARD.DATA.CARD_NUMBER" />
            </label>
            <input
              type="tel"
              name="cardNumber"
              className="card-input__input"
              autoComplete="off"
              onChange={onCardNumberChange}
              maxLength="19"
              ref={cardNumberRef}
              onFocus={(e) => onCardInputFocus(e, 'cardNumber')}
              onBlur={onCardInputBlur}
              value={cardNumber}
            />
          </div>

          <div className="card-input">
            <label htmlFor="cardName" className="card-input__label">
              <Text tid="CARD.DATA.CARD_HOLDER" />
            </label>
            <input
              type="text"
              className="card-input__input"
              autoComplete="off"
              name="cardHolder"
              onChange={handleFormChange}
              value={cardHolder}
              ref={cardHolderRef}
              onFocus={(e) => onCardInputFocus(e, 'cardHolder')}
              onBlur={onCardInputBlur}
            />
          </div>

          <div className="card-form__row">
            <div className="card-form__col">
              <div className="card-form__group">
                <label htmlFor="cardMonth" className="card-input__label">
                  <Text tid="CARD.DATA.CARD_DATE" />
                </label>
                <select
                  className="card-input__input -select"
                  value={cardMonth}
                  name="cardMonth"
                  onChange={handleFormChange}
                  ref={cardDateRef}
                  onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                  onBlur={onCardInputBlur}
                >
                  <option value="" disabled>
                    {cardMonthTitle}
                  </option>

                  {monthsArr.map((val, index) => (
                    <option key={index} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
                <select
                  name="cardYear"
                  className="card-input__input -select"
                  value={cardYear}
                  onChange={handleFormChange}
                  onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                  onBlur={onCardInputBlur}
                >
                  <option value="" disabled>
                    {cardYearTitle}
                  </option>

                  {yearsArr.map((val, index) => (
                    <option key={index} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-form__col -cvv">
              <div className="card-input">
                <label htmlFor="cardCvv" className="card-input__label">
                  <Text tid="CARD.DATA.CARD_CVV" />
                </label>
                <input
                  type="tel"
                  className="card-input__input"
                  maxLength="4"
                  autoComplete="off"
                  name="cardCvv"
                  value={cardCvv}
                  onChange={handleFormChange}
                  onFocus={onCvvFocus}
                  onBlur={onCvvBlur}
                  ref={cardCvvRef}
                />
              </div>
            </div>
          </div>
          <button type="submit" disabled={formDisabled} className="cta cta-full-width">
            <Text tid="CARD.DATA.BUTTON" />
          </button>
          {error && (
            <span className="error" style={{ marginTop: '10px' }}>
              {errorMessage}
            </span>
          )}
        </form>
      )}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Progress size={70} />
          <h3 style={{ marginTop: '24px', padding: 0 }}>
            <Text tid="CARD.LOADING" />
          </h3>
        </div>
      )}
    </React.Fragment>
  );
};

PaymentDataView.propTypes = {
  cardMonth: PropTypes.string,
  cardYear: PropTypes.number,
  onUpdateState: PropTypes.func,
  cardNumberRef: PropTypes.object,
  cardHolderRef: PropTypes.object,
  cardDateRef: PropTypes.object,
  onCardInputFocus: PropTypes.func,
  onCardInputBlur: PropTypes.func,
  cardCvv: PropTypes.number,
  cardCvvRef: PropTypes.object,
  cardHolder: PropTypes.string,
  formDisabled: PropTypes.bool,
  onSubmit: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
};
