import { MAIN_VARS } from '../../configs/main-var';
import { SECRECTS } from '../../configs/secrets';
import type { IDonation } from '../../types/donation';

export const haveContentCheck = (message: string) => {
  return message.includes('/') && message.includes('{');
};

export const donationCheck = (message: string) => {
  return message.includes('donate-stream');
};

export const messageParser = (message: string): IDonation | null => {
  const regex = /\["donate-stream",(.*?)\}\]/gm;
  const payloadStr = regex.exec(message);

  if (!payloadStr) return null;

  console.log('payloadStr', payloadStr);
  const payload = JSON.parse(payloadStr[0]);

  return {
    name: payload[1].payload.displayName,
    amount: payload[1].payload.donationAmount,
    message: payload[1].payload.message,
    currency: 'VNĐ',
  };
};

export const PDWSUG = () => {
  return `${MAIN_VARS.PLAYER_DUO_WS_URL}/?token=${SECRECTS.API_KEY}&deviceType=browser&EIO=3&transport=websocket`;
};
