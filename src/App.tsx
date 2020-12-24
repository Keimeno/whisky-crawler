import React, {useState} from 'react';
import './App.css';
import {Home} from './components/Home';
import {Loader} from './components/Loader';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Whisky} from './components/Whisky';

export const App = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/whisky/:name">
            <Whisky />
          </Route>
          <Route path="/">
            <div>
              {!hasLoaded ? (
                <Loader onLoad={hasLoaded => setHasLoaded(hasLoaded)} />
              ) : (
                <Home />
              )}
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};
