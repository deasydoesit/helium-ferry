import React, { ReactElement, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import QRCode from 'react-qr-code';
import './Qr.css';

export const Qr = (): ReactElement => {
  const [input, setInput] = useState<string>('Input your text here for QR encoding');

  return (
    <div className="Qr-root">
      <div className="Qr-view">
        <div className="Qr-pad">
          <div className="Qr-container">
            <QRCode size={300} value={input} />
          </div>
          <div className="Input-container">
            <TextField
              className="Input"
              multiline
              rows={2}
              defaultValue="Input your text here for QR encoding ..."
              variant="outlined"
              onChange={(event) => setInput(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
