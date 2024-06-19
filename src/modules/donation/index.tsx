/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable jsx-a11y/media-has-caption */

import _ from 'lodash';
import {
  animate,
  m as motion,
  useAnimate,
  useWillChange,
  domAnimation,
  LazyMotion,
} from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import useFitText from 'use-fit-text';
import sound from '../../assets/sound-effect.mp3';
import { IDonation } from '../../types/donation';
import { useInterval } from 'usehooks-ts';
import { useRecoilState } from 'recoil';
import donationAtom from '../../atoms/donations.atom';
import usePlayerDuo from '../../hooks/usePlayerDuo';

import YuriDancing from '../../assets/images/yuri-dancing.gif';

function Donation() {
  const {} = usePlayerDuo();

  const audioRef = useRef<HTMLAudioElement>(null);
  const { fontSize, ref } = useFitText();
  const { fontSize: amountFontSize, ref: amountRef } = useFitText();
  const { fontSize: messageFontSize, ref: messageRef } = useFitText();

  const willChange = useWillChange();

  const [avatarScope] = useAnimate();
  const [nameScope] = useAnimate();
  const [amountScope] = useAnimate();
  const [messageScope] = useAnimate();

  const [donations, setDonation] = useRecoilState(donationAtom);

  const [current, setCurrent] = useState<IDonation | null>(null);

  const playDonation = useCallback(
    (donation: IDonation) => {
      setCurrent(donation);

      const animation = async () => {
        await animate(
          avatarScope.current,
          { marginLeft: '60px' },
          { duration: 1, ease: 'backInOut' }
        );

        animate(
          avatarScope.current,
          { outline: '10px solid #FFC8D5' },
          { duration: 0.4, ease: 'backInOut' }
        );

        await animate(
          nameScope.current,
          { marginLeft: 0 },
          { duration: 1, ease: 'circInOut' }
        );

        await delay(1000);

        await animate(
          nameScope.current,
          { marginLeft: '-1500px' },
          { duration: 1, ease: 'circInOut' }
        );

        await animate(
          amountScope.current,
          { marginLeft: 0 },
          { duration: 1, ease: 'circInOut' }
        );

        await delay(1000);

        await animate(
          amountScope.current,
          { marginLeft: '-1500px' },
          { duration: 1, ease: 'circInOut' }
        );

        await animate(
          messageScope.current,
          { marginLeft: 0 },
          { duration: 1, ease: 'circInOut' }
        );

        await delay(10000);

        await animate(
          messageScope.current,
          { marginLeft: '-1500px' },
          { duration: 1, ease: 'circInOut' }
        );

        animate(
          avatarScope.current,
          { outline: '0px solid #FFC8D5' },
          { duration: 0.8, ease: 'circInOut' }
        );

        await animate(
          avatarScope.current,
          { marginLeft: '-300px' },
          { duration: 1, ease: 'backIn' }
        );

        setCurrent(null);
      };

      setTimeout(() => {
        audioRef.current?.play();
        animation();
      }, 0);
    },
    [amountScope, avatarScope, messageScope, nameScope]
  );

  useInterval(() => {
    if (current === null) {
      const temp = _.clone(donations);

      const latestDonation = temp.pop();

      if (latestDonation) {
        setDonation(temp);
        playDonation(latestDonation);
      }
    }
  }, 2000);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="w-[1920px] h-[1080px] text-[60px] relative overflow-hidden">
        <motion.div
          ref={avatarScope}
          style={{ willChange }}
          initial={{ marginLeft: '-300px' }}
          className="bg-white z-[3] overflow-hidden absolute w-[200px] h-[200px] m-auto mt-[60px] ml-[60px] left-0 right-0 top-0 bottom-0 rounded-full"
        >
          <img alt="dummy" src={YuriDancing} width="100%" height="100%" />
        </motion.div>
        <motion.div
          ref={ref}
          style={{ willChange }}
          className=" z-[2] flex flex-col justify-center absolute w-[900px] h-[200px] m-auto mt-[60px] pl-[130px] ml-[60px] left-[100px] right-0 top-0 bottom-0 rounded-xl overflow-hidden"
        >
          <div className="w-full h-full relative">
            <motion.div
              ref={nameScope}
              initial={{ marginLeft: '-1500px' }}
              className="absolute flex items-center justify-start font-bold w-[700px] h-[200px] text-white"
            >
              <p
                ref={messageRef}
                className="drop-shadow-[0_5.2px_5.2px_rgba(0,0,0,0.8)]"
                style={{ fontSize: messageFontSize }}
              >
                cảm ơn <span className="text-yellow-400">{current?.name}</span>
              </p>
            </motion.div>

            <motion.div
              ref={amountScope}
              style={{ willChange }}
              initial={{ marginLeft: '-1500px' }}
              className="absolute flex items-center justify-start font-bold w-[700px] h-[200px] text-white"
            >
              <p
                ref={amountRef}
                className="drop-shadow-[0_5.2px_5.2px_rgba(0,0,0,0.8)]"
                style={{ fontSize: amountFontSize }}
              >
                vì đã ném{' '}
                <span className="text-yellow-400">
                  {current?.amount?.toLocaleString()} {current?.currency}
                </span>{' '}
                qua cửa sổ nhà <span className="text-[#FFC8D5]">Amie</span>
              </p>
            </motion.div>

            <motion.p
              ref={messageScope}
              style={{ fontSize, willChange }}
              initial={{ marginLeft: '-1500px' }}
              className="absolute flex items-center justify-start font-bold w-[700px] h-[200px] text-white"
            >
              <p
                ref={messageRef}
                className="drop-shadow-[0_5.2px_5.2px_rgba(0,0,0,0.8)]"
                style={{ fontSize: messageFontSize }}
              >
                {current?.message}
              </p>
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          className="bg-white absolute w-[200px] h-[200px] m-auto left-0 right-0 top-0 bottom-0 rounded-full"
        ></motion.div>

        <audio ref={audioRef} src={sound} />
      </div>
    </LazyMotion>
  );
}

export default Donation;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
