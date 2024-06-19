import { animate, motion, useAnimate } from 'framer-motion';
import { RiArrowRightDoubleFill } from 'react-icons/ri';

import { ChangeEvent, useEffect, useState } from 'react';
import { SUBMIT_FORM_STATE } from './constants';
import requester from './configs/axios';

import RightArrow from '../../assets/images/arrow-point-to-right.png';
import GarfieldHead from '../../assets/images/garfield-head.png';

const Hightlight = () => {
  const [formState, setFormState] = useState(SUBMIT_FORM_STATE.NONE);
  const [message, setMessage] = useState<string>();
  const [url, setUrl] = useState<string>('');
  const [containerScope] = useAnimate();
  const [inputScope] = useAnimate();
  const [submitScope] = useAnimate();

  // Mapped-value
  const formBorderColor =
    formState === SUBMIT_FORM_STATE.ERROR
      ? 'border-red-400'
      : formState === SUBMIT_FORM_STATE.SUCCESS
      ? 'border-green-400'
      : 'border-orange-400';

  const placeholderText =
    formState === SUBMIT_FORM_STATE.NONE
      ? 'Nhập link của bạn tại đây..'
      : message;

  const animation = async () => {
    await animate(
      containerScope.current,
      { marginTop: '40%' },
      { duration: 0.5 }
    );
    await animate(
      inputScope.current,
      { opacity: 1, maxWidth: '800px' },
      { duration: 0.7, ease: 'easeIn', delay: 200 }
    );

    await animate(
      submitScope.current,
      { opacity: 1, maxWidth: '800px' },
      { duration: 0.7, ease: 'easeIn', delay: 200 }
    );

    animate(
      submitScope.current,
      { translateX: '10px' },
      { repeat: Infinity, repeatType: 'reverse', duration: 0.5 }
    );
  };

  // Event-Handlers
  const urlValidator = (text: string) => {
    return (
      text.includes('https://youtube.com') ||
      text.includes('https://youtu.be') ||
      text.includes('https://www.tiktok.com')
    );
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setUrl(text);
  };

  const onError = (err: Error) => {
    setFormState(SUBMIT_FORM_STATE.ERROR);
    setMessage(err.message);
  };

  const onSubmit = async () => {
    const isValid = urlValidator(url);

    if (!isValid) {
      const err = new Error('Link bạn nhập không hợp lệ đó');
      onError(err);
      setUrl('');
      return;
    }

    try {
      await requester.post('/form/highlight', { url });
      setFormState(SUBMIT_FORM_STATE.SUCCESS);
      setMessage('Cảm ơn bạn đã gửi highlight cho mình');
    } catch (err) {
      onError(err as Error);
    }
  };

  useEffect(() => {
    animation();
  }, []);

  return (
    <motion.div className="relative w-[100vw] min-h-[100vh] h-[max-content] bg-yellow-100">
      <motion.div
        ref={containerScope}
        transition={{ duration: 1 }}
        initial={{ marginTop: '-100vh' }}
        className="absolute top-0 flex flex-col items-center bottom-0 right-0 left-0 m-auto"
      >
        <motion.img
          src={GarfieldHead}
          className="sm:w-[500px] mb-10"
          alt="garfield-avatar"
        />
        <motion.div className="flex flex-nowrap items-center">
          <motion.input
            value={url}
            ref={inputScope}
            onChange={onChange}
            initial={{ opacity: 0, maxWidth: '10px' }}
            placeholder={placeholderText}
            className={
              'sm:w-[500px] outline-none text-orange-600 placeholder-orange-300 font-bold text-2xl rounded-2xl p-4 bg-transparent border-4 transition-all ' +
              formBorderColor
            }
          />
          <motion.button className="flex items-center" onClick={onSubmit}>
            <motion.p
              ref={submitScope}
              initial={{ opacity: 0, maxWidth: '0px' }}
              animate={{ translateX: '10px' }}
              transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 0.5,
              }}
            >
              <RiArrowRightDoubleFill className="text-[90px] text-orange-300" />
            </motion.p>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hightlight;

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
