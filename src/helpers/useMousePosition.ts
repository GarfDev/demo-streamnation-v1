import React from 'react';

const useMousePosition = () => {
  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      alert(JSON.stringify({ x: ev.clientX, y: ev.clientY }));
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return true;
};
export default useMousePosition;
