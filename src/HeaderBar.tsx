import React, { ReactElement, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Emoji } from './Emoji';
import './HeaderBar.css';

export const HeaderBar = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
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
            <div className="display-small">
              <Button
                className="CustomButton"
                aria-controls="dropdown-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon />
              </Button>
              <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <a href="/qr" className="anchor-reset">
                    QR
                  </a>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <a href="/scanner" className="anchor-reset">
                    Scanner
                  </a>
                </MenuItem>
              </Menu>
            </div>
            <div className="display-large">
              <a href="/qr" className="anchor-reset">
                <Button className="CustomButton" variant="contained" size="large" color="inherit">
                  QR
                </Button>
              </a>
              <a href="/scanner" className="anchor-reset">
                <Button className="CustomButton" variant="contained" size="large" color="inherit">
                  Scanner
                </Button>
              </a>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
