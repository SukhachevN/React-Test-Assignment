```typescript
import React, { FC, useReducer } from "react";

export const Parent: FC = () => {
    return (
        <div>
            <Child>
                <!-- How to get `open` value here and work with it? -->
                <!-- e.g. open ?? <SomeOtherComponent/> -->
            </Child>
        </div>
    )
};


const Child: FC = () => {
    const [open, toggleOpen] = useReducer(value => !value, false);

    return (
        <div>
            <button onClick={toggleOpen}>
                Toggle
            </button>
        </div>
    )
};
```

1. What options do we have to get `open` value in Parent component?

   - Lift state to parent
   - Use state manager.
   - Create state(via useState hook) in Parent, pass setState to Child as prop and in Child's useEffect on change "open" call setState.

2. What benefits and drawbacks of each method?
   - Lift state:
     - benefit: simple solution, easy to acces value of "open" in Parent component and pass it to another childs, or use it inside component.
     - drawback: changing "open" will force rerender another childs, it can be fixed by adding memoization, also if Parent have deep nested childs it will reason of props drilling.
   - State manager:
     - benefit: "open" state can be accessed from any component in project.
     - drawback: more complex solution, need write more code.
   - Create state in Parent, which duplicate "open" in Child:
     - benefit: simple, if Child would have more complex state, which including "open", and we need only "open" in Parent, it's good way, becouse we will not make logic of Parent component complex.
     - drawback: same drawbacks as lifting state, same result as lifting state but need more extra state.

If Parent doesnt have deep nested childs then use lifting state up to Parent, else use state manager, becouse lifting state is reason of props drilling if deep nested components need "open" state.
