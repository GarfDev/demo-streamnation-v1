import { atom } from 'recoil';
import { IDonation } from '../types/donation';

const donationAtom = atom<IDonation[]>({
  key: 'donation-state',
  default: [],
});

export default donationAtom;
