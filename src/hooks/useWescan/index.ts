import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { IDonation } from '../../types/donation';
import historyAtom from '../../atoms/history.atom';
import donationAtom from '../../atoms/donations.atom';
import { MAIN_VARS } from '../../configs/main-var';
import { useRecoilState } from 'recoil';

const useWescan = () => {
  const [pingInterval] = useState(120000);

  const { sendMessage, readyState, lastMessage } = useWebSocket(
    MAIN_VARS.WE_SCAN_WS_URL
  );

  const [donations, setDonations] = useRecoilState(donationAtom);

  const donationPush = useCallback((donation: IDonation) => {
    // Clone current history
    const temp = _.clone(donations);
    temp.push(donation);

    // Set new value to history atom
    setDonations(temp);
  }, []);

  const authorization = () => {
    const first = {
      event: 'pusher:subscribe',
      data: { auth: '', channel: 'b6e29376f31140a186644dbbf2c2ef54' },
    };

    const sec = {
      event: 'pusher:subscribe',
      data: { auth: '', channel: 'b6e29376f31140a186644dbbf2c2ef54.events' },
    };

    sendMessage(JSON.stringify(first));
    sendMessage(JSON.stringify(sec));
  };

  const ping = () => {
    const payload = { event: 'pusher:ping', data: {} };
    sendMessage(JSON.stringify(payload));
  };

  useEffect(() => {
    let timer: NodeJS.Timer;

    if (pingInterval > 0) {
      timer = setInterval(ping, pingInterval);
    }

    return () => {
      clearInterval(timer);
    };
  }, [pingInterval]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      authorization();
    }
  }, [readyState]);

  useEffect(() => {
    if (lastMessage) {
      const payload = JSON.parse(lastMessage.data);
      payload.data = JSON.parse(payload.data);

      console.log(payload);

      if (payload.data.type === 'donation') {
        const donation: IDonation = {
          name: payload.data.data.name,
          amount: payload.data.data.amount,
          message: payload.data.data.message,
          currency: 'VNĐ',
        };
        donationPush(donation);
      }
    }
  }, [lastMessage]);

  return {};
};

export default useWescan;

// {"event":"notification","data":"{\"type\": \"donation\", \"data\": {\"amount\": \"10000\", \"message\": \"Test th\\u00f4i l\\u00e0m g\\u00ec c\\u0103ng v\\u1eady\", \"bank_code\": \"VCB\", \"name\": \"M\\u1ed9t ai \\u0111\\u00f3\", \"voices\": {\"token\": \"b6c51d0a80e9609b2471838eaf5525a7\", \"token_time\": \"1717395525\"}}}","channel":"b6e29376f31140a186644dbbf2c2ef54"}
