import React, {useState} from 'react';
import './App.css';
import {Loader} from './components/Loader';

export const App = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        {!hasLoaded && <Loader onLoad={hasLoaded => setHasLoaded(hasLoaded)} />}
      </header>
    </div>
  );
};

// export const initialize = async () => {
//   // load bottlers

//   const bottlers = await loadBottlers();

//   process.stdout.write('\n');

//   // load whisky pages
//   const whiskyPages: WhiskyPage[] = [];

//   for (const bottler of bottlers) {
//     whiskyPages.push(...(await loadWhiskyPages(bottler)));

//     const position = bottlers.findIndex(value => value.id === bottler.id) + 1;
//   }
// };

// initialize();
