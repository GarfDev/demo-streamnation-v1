import React from 'react';

const useMousePosition = () => {
  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      alert(JSON.stringify({ x: ev.clientX, y: ev.clientY }));
    };
    window.addEventListener('click', updateMousePosition);
    return () => {
      window.removeEventListener('click', updateMousePosition);
    };
  }, []);

  return true;
};
export default useMousePosition;
