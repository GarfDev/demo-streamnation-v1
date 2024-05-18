import { atom } from 'recoil';

const historyAtom = atom<MessageEvent<unknown>[]>({
  key: 'history-state',
  default: [],
});

export default historyAtom;
