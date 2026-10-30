import React, { useEffect, useState } from 'react';

// Nombre qui défile de 0 à `to` quand `start` passe à true (décélération en fin de course)
const CountUp = ({ to, start, duration = 1800, suffix = '', locale = 'fr-FR' }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    let frame;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, to, duration]);

  return <>{value.toLocaleString(locale)}{suffix}</>;
};

export default CountUp;
