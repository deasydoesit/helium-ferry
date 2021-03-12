import React, { ReactElement } from 'react';

export const Emoji = (props: { label: string; symbol: string }): ReactElement => (
  <span
    className="Emoji"
    role="img"
    aria-label={props.label ? props.label : ''}
    aria-hidden={props.label ? 'false' : 'true'}
  >
    {props.symbol}
  </span>
);
