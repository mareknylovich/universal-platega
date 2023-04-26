export const cardMask = (card) => {
  let cardNumber = card;

  if (/^3[47]\d{0,13}$/.test(card)) {
    cardNumber = card.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
  } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(card)) {
    cardNumber = card.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
  } else if (/^\d{0,16}$/.test(card)) {
    cardNumber = card
      .replace(/(\d{4})/, '$1 ')
      .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
      .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
  }

  return cardNumber;
};
