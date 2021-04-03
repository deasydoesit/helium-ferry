import React, { ReactElement } from 'react';
import Typography from '@material-ui/core/Typography';
import { Emoji } from './Emoji';
import qrCode from './qr-code.svg';
import network from './network.png';
import './About.css';

export const About = (): ReactElement => (
  <div className="About-root">
    <div className="Headline-container">
      <div className="Headline-pad">
        <div className="Imagery-container">
          <div className="Qr-container">
            <img src={qrCode} className="Qr-image" alt="QR code pointing to www.heliumferry.com" />
          </div>
          <div className="Emoji-container">
            <Emoji label="ferry" symbol="⛴️" />
          </div>
          <div className="Network-container">
            <img src={network} className="Network-image" alt="A distributed network topology" />
          </div>
        </div>
        <div className="Title-container">
          <Typography className="Title" variant="h3">
            Ferry TXNs, from QR Code to Helium Network!
          </Typography>
        </div>
      </div>
    </div>
    <div className="Description-container">
      <div className="Description-pad">
        <Typography className="Description-header" variant="h4">
          Helium Ferry helps bridge the divide between an airgapped CLI wallet and the Helium
          Network.
        </Typography>
        <ul>
          <li className="List-item">
            Produce a QR code of a base64 encoded, signed transaction intended for the Helium
            Network
          </li>
          <li className="List-item">
            Scan the QR code with Helium Ferry and review the transaction details
          </li>
          <li className="List-item">Submit the transaction to the Helium Network, easy peasy</li>
        </ul>
      </div>
    </div>
  </div>
);
