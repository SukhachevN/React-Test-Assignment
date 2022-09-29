```typescript
import React, { FC, useState } from 'react';

export const Parent: FC = () => {
  const [count, setCount] = useState(0);
  const [extraA, setExtraA] = useState(1);
  const [extraB, setExtraB] = useState(2);

  return (
    <LayerA count={count} setCount={setCount} extraA={extraA} extraB={extraB} />
  );
};

/**
 * LAYER A -------------------------------------------------
 */

type LayerAProps = {
  count: number;
  setCount: (value: number) => void;
  extraA: number;
  extraB: number;
};

const LayerA: FC<LayerAProps> = ({ count, setCount, extraA, extraB }) => (
  <div>
    <LayerB count={count} setCount={setCount} extraB={extraB} />
    <div>{extraA}</div>
  </div>
);

/**
 * LAYER B -------------------------------------------------
 */

type LayerBProps = {
  count: number;
  setCount: (value: number) => void;
  extraB: number;
};

const LayerB: FC<LayerBProps> = ({ count, setCount, extraB }) => (
  <div>
    <Child count={count} setCount={setCount} />
    <div>{extraB}</div>
  </div>
);

/**
 * LAST CHILD ----------------------------------------------
 */

type ChildProps = {
  count: number;
  setCount: (value: number) => void;
};

const Child: FC<ChildProps> = ({ count, setCount }) => (
  <>
    <p>{count}</p>
    <button onClick={() => setCount(count + 1)}>Inc</button>
  </>
);
```

1. Every time when count change it will force rerender of childs of Parent component, but in reality only Child component need count value, Layers components just pass it through themselfes. Also if extraA will be changed, then it force rerenders of LayerB and Child components, but they dont depends on this prop.

if dont look to props drilling, also need reuse defined types, for example if type of extraB changes to another, then need redefine extraB type in other components, if reuse and extend existing types, then this problem will be solved. But this problem also will be fixed if fix props drilling.

2. Use state manager (React context, Redux, MobX, etc...), add memoization(React.memo) to components.

3. Benefit of adding state manager is that layers components will dont need pass throught themselfes unnecessary props, for LayerA unnecessary props is: count, setCount, extraB; for LayerB: count, setCount, as result unnecessary rerenders will not happend. Drawback is that need write extra code to add and configure state manager, it's make application more complex.
