import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import useWebSocket from 'react-use-websocket';
import {
  PDWSUG,
  donationCheck,
  haveContentCheck,
  messageParser,
} from './utils';
import { SECRECTS } from '../../configs/secrets';
import { IDonation } from '../../types/donation';
import historyAtom from '../../atoms/history.atom';
import donationAtom from '../../atoms/donations.atom';

const usePlayerDuo = () => {
  const [pingInterval, setPingInterval] = useState(-1);

  const { sendMessage, readyState, lastMessage } = useWebSocket(PDWSUG());

  const [history, setHistory] = useRecoilState(historyAtom);
  const [donations, setDonations] = useRecoilState(donationAtom);

  // Functions

  const historyPush = useCallback(
    (message: MessageEvent<unknown>) => {
      // Clone current history
      const temp = _.clone(history);
      temp.push(message);

      // Set new value to history atom
      setHistory(temp);
    },
    [history, setHistory]
  );

  const authorization = () => {
    const firstAuth = `40/inside?token=${SECRECTS.API_KEY}&deviceType=browser`;
    const secAuth = `40/outside?deviceType=browser&playerId=5e3ff61df87d5c2f78e68974`;
    sendMessage(firstAuth);
    sendMessage(secAuth);
  };

  const donationPush = useCallback(
    (donation: IDonation) => {
      // Clone current history
      const temp = _.clone(donations);
      temp.push(donation);

      // Set new value to history atom
      setDonations(temp);
    },
    [history, setHistory]
  );

  const initialize = (message: string) => {
    const payloadStr = message.replace('0', '');
    // {"sid":"Hd_M6Gcn-uj2heNKM-X9","upgrades":[],"pingInterval":25000,"pingTimeout":5000}
    const payload = JSON.parse(payloadStr);
    setPingInterval(payload.pingInterval);

    authorization();
  };

  const ping = () => {
    sendMessage('2');
  };

  // Effects
  // 0{"sid":"Hd_M6Gcn-uj2heNKM-X9","upgrades":[],"pingInterval":25000,"pingTimeout":5000}

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
    if (lastMessage) {
      if (lastMessage.data[0] === '0') {
        initialize(lastMessage.data);
      } else {
        const isHaveContent = haveContentCheck(lastMessage.data);
        if (isHaveContent) {
          const isDontaion = donationCheck(lastMessage.data);
          if (isDontaion) {
            const donation = messageParser(lastMessage.data);
            if (donation) donationPush(donation);
          }
        }
      }
      historyPush(lastMessage);
    }
  }, [lastMessage]);

  return { donations: donations || [], readyState };
};

export default usePlayerDuo;
