import React, { ReactElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Emoji } from './Emoji';
import './HeaderBar.css';

export const HeaderBar = (): ReactElement => (
  <div className="HeaderBar-root">
    <AppBar position="static" color="inherit">
      <Toolbar className="ToolBar-root">
        <div className="Title-root">
          <a href="/" className="Title-container anchor-reset">
            <Typography className="Title" variant="h6">
              Helium Ferry
            </Typography>{' '}
            <Emoji label="ferry" symbol="⛴️" />
          </a>
        </div>
        <div className="button-container">
          <a href="/scanner" className="anchor-reset">
            <Button className="CustomButton" variant="contained" size="large" color="inherit">
              Scanner
            </Button>
          </a>
        </div>
      </Toolbar>
    </AppBar>
  </div>
);
