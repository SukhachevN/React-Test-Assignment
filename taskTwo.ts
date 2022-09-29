export const counter = (initVal: number = 0) => {
  let currentVal = initVal;

  if (isNaN(currentVal) || !isFinite(currentVal)) currentVal = 0;

  const getCurrentVal = () => currentVal;

  const increase = () => {
    currentVal++;
  };

  return [getCurrentVal, increase];
};
