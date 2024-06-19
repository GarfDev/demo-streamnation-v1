import { animate, motion, useAnimate, useWillChange } from 'framer-motion';

import { useEffect, useState } from 'react';
import GarfieldWalkingGif from '../../assets/images/garfield-walking.gif';
import GarfieldWorkerWalkingGif from '../../assets/images/garfield-worker-walking.gif';

const texts = [
  'cảm ơn các bạn đã theo dõi, cho mình xin 1 tim được không?',
  'ủng hộ mình tại đây: playerduo.net/conmeocam666, cảm ơn mọi người ạ',
  'ủng hộ mình tại đây: wescan.vn/conmeocam, cảm ơn mọi người ạ',
  'stream có các cảnh quay sử dụng các kỹ năng cao ở cường độ cao, vui lòng cân nhắc ý kiến chuyên môn trước khi xem',
  'Chỉ với 78 cành các bạn sẽ sở hữu ngay cho mình Niềm vui, còn chần chờ gì nữa mà không đăng ký gói hội viên mang tên Niềm Vui ạ.',
  'Mình stream từ 2h đến 6h hàng ngày, nhớ đón xem nha',
];

const Notification = () => {
  const [current, setCurrent] = useState(texts[0]);

  const willChange = useWillChange();
  const [scope] = useAnimate();

  useEffect(() => {
    const callback = () => {
      setCurrent(rand(texts));

      const animation = async () => {
        await animate(scope.current, { opacity: 1 });
        await animate(
          scope.current,
          { translateX: '-200%' },
          { type: 'spring', mass: 0.5, stiffness: 0.5 }
        );

        await animate(scope.current, { opacity: 0 });
        await animate(scope.current, { translateX: '100%' });
      };

      animation();
    };

    callback();

    const id = setInterval(callback, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-[1200px] h-[300px] relative overflow-hidden">
      <motion.div className="abolute w-[1200px] h-[100] overflow-hidden absolute m-auto left-0 right-0 bottom-0">
        <motion.div
          ref={scope}
          style={{ willChange }}
          initial={{ translateX: '200%' }}
          className="w-[max-content] flex flex-nowrap items-end"
        >
          <img
            src={GarfieldWalkingGif}
            style={{ transform: 'scaleX(-1)' }}
            alt="garfield-walking"
            width={120}
          />

          <p className="text-white text-[40px] uppercase font-extrabold drop-shadow-[0_5.2px_5.2px_rgba(0,0,0,0.8)] ml-5">
            {current}
          </p>

          <img
            src={GarfieldWorkerWalkingGif}
            alt="garfield-walking-2"
            width={120}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Notification;

function rand(items: string[]) {
  // "~~" for a closest "int"
  return items[~~(items.length * Math.random())];
}
