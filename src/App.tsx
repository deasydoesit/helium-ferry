import React, { ReactElement } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HeaderBar } from './HeaderBar';
import { About } from './About';
import { Encoder } from './Encoder';
import { Scanner } from './Scanner';
import { FooterBar } from './FooterBar';
import './App.css';

export const App = (): ReactElement => (
  <div>
    <HeaderBar />
    <BrowserRouter>
      <Switch>
        <Route path="/encoder">
          <Encoder />
        </Route>
        <Route path="/scanner">
          <Scanner />
        </Route>
        <Route path="/">
          <About />
        </Route>
      </Switch>
    </BrowserRouter>
    <FooterBar />
  </div>
);
