import React, { ReactElement, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import QRCode from 'react-qr-code';
import './Encoder.css';

export const Encoder = (): ReactElement => {
  const [input, setInput] = useState<string>('Input your text here for Encoder encoding');

  return (
    <div className="Encoder-root">
      <div className="Encoder-view">
        <div className="Encoder-pad">
          <div className="Encoder-container">
            <QRCode size={350} value={input} />
          </div>
          <div className="Input-container">
            <TextField
              className="Input"
              multiline
              rows={2}
              placeholder="Input your text here for QR encoding"
              variant="outlined"
              onChange={(event) => setInput(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
