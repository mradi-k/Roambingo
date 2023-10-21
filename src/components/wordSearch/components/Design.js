import React from 'react';

// @ts-ignore
import ConfettiGenerator from 'confetti-js';

export default function Confetti() {
  React.useEffect(() => {
    const confettiSettings = { target: 'my-canvas' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    return () => confetti.clear(); 
  }, []); // add the var dependencies or not

  return <canvas style={{
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
    width: '100%',
  }}  id="my-canvas"></canvas>;
}
