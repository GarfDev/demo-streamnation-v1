import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
  PDWSUG,
  donationCheck,
  haveContentCheck,
  messageParser,
} from './utils';
import { IDonation } from '../../types/donation';
import historyAtom from '../../atoms/history.atom';
import donationAtom from '../../atoms/donations.atom';

const usePlayerDuo = () => {
  const [pingInterval, setPingInterval] = useState(-1);

  const { sendMessage, readyState, lastMessage } = useWebSocket(PDWSUG(), {
    reconnectInterval: 1,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
  });

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

  function authorization() {
    // 5f191a4f315035314c20482b
    // 5e3ff61df87d5c2f78e68974
    const secAuth = `40/outside?deviceType=browser&playerId=5e3ff61df87d5c2f78e68974`;
    sendMessage(secAuth);
  }

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
      }
      if (lastMessage.data[0] !== '0') {
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

  useEffect(() => {
    console.log('readyState', readyState);
    if (readyState === ReadyState.CLOSED) {
      authorization();
    }

    if (readyState === ReadyState.OPEN) {
      console.log('readyState', readyState, 'connected');

      authorization();
    }
  }, [readyState]);

  useEffect(() => {
    console.log(pingInterval);
  }, [pingInterval]);

  return { donations: donations || [], readyState };
};

export default usePlayerDuo;
