import React, { ReactElement, useState } from 'react';
import QRCode from 'react-qr-code';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { a11yProps, timeout } from './utils';
import { TabPanelProps } from './types';
import './Encoder.css';

export const Encoder = (): ReactElement => {
  const [isEncoding, setIsEncoding] = useState(false);
  const [tab, setTab] = useState(0);
  const [txnType, setTxnType] = useState<string>('');
  const [qrInput, setQrInput] = useState<string>('heliumferry.com');
  const theme = useTheme();

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const handleChangeTabIndex = (index: number) => {
    setTab(index);
  };
  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography component={'span'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  const handleCreateQR = async (): Promise<void> => {
    let value = '';
    //@ts-ignore
    if (document !== null && document.getElementById('Input') !== null) {
      value =
        //@ts-ignore
        document && document.getElementById('Input') && document.getElementById('Input').value;
    }
    setIsEncoding(true);
    await timeout(1000);
    setQrInput(value);
    setIsEncoding(false);
  };

  return (
    <div className="Encoder-root">
      <div className="Form-container">
        <div className="Form-pad">
          <div className="Tab-container">
            <AppBar className="Tab-bar" position="static" color="default">
              <Tabs
                value={tab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab className="Freeform-tab" label="Freeform Encoder" {...a11yProps(0)} />
                <Tab className="Cli-Command-tab" label="CLI Command Encoder" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              className="Panel-container"
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={tab}
              onChangeIndex={handleChangeTabIndex}
            >
              <TabPanel value={tab} index={0} dir={theme.direction}>
                <div className="Freeform-view">
                  <div className="Freeform-card">
                    <div className="Freeform-body">
                      <div className="Input-container">
                        <TextField
                          id="Input"
                          className="Input"
                          multiline
                          rows={11}
                          placeholder="Input your text here for QR encoding"
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div className="QR-button-container">
                      <Button
                        className="QR-button"
                        variant="contained"
                        size="large"
                        color="inherit"
                        onClick={() => handleCreateQR()}
                        disabled={isEncoding}
                      >
                        Encode
                      </Button>
                      {isEncoding && <CircularProgress size={24} className="Encoding-progress" />}
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value={tab} index={1} dir={theme.direction}>
                <div className="Cli-Command-view">
                  <div className="Txn-type-container">
                    <label htmlFor="Txn-type-select" id="Txn-type-select-label">
                      Transaction Type
                    </label>
                  </div>
                  <div className="Txn-type-select-select-container">
                    <FormControl className="Form-control">
                      <Select
                        labelId="Txn-type-select-label"
                        id="Txn-type-select"
                        className="Network-select-selector"
                        value={txnType}
                        onChange={(event) => setTxnType(event.target.value as string)}
                      >
                        <MenuItem value={'payment'}>Payment</MenuItem>
                        <MenuItem value={'stake'}>Stake</MenuItem>
                        <MenuItem value={'unstake'}>Unstake</MenuItem>
                        <MenuItem value={'transfer accept'}>Transfer Accept</MenuItem>
                        <MenuItem value={'transfer create'}>Transfer Create</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {txnType === 'payment' && (
                    <>
                      <TextField
                        required
                        id="payee"
                        className="payee-field"
                        label="Payee"
                        helperText="Recipient address where to send funds"
                        variant="outlined"
                        onChange={() => console.log('hello')}
                      />
                      <TextField
                        required
                        id="amount"
                        className="amount-field"
                        label="Amount"
                        helperText="Amount to send to recipient address"
                        variant="outlined"
                      />
                      <TextField
                        required
                        id="fee"
                        className="fee-field"
                        label="Fee"
                        helperText="Fee in Data Credits for the transaction"
                        variant="outlined"
                      />
                      <TextField
                        required
                        id="nonce"
                        className="nonce-field"
                        label="Nonce"
                        helperText="Nonce of the wallet"
                        variant="outlined"
                      />
                      <div className="QR-button-container">
                        <Button
                          className="QR-button"
                          variant="contained"
                          size="large"
                          color="inherit"
                          onClick={() => handleCreateQR()}
                          disabled={isEncoding}
                        >
                          Encode
                        </Button>
                        {isEncoding && <CircularProgress size={24} className="Encoding-progress" />}
                      </div>
                    </>
                  )}
                </div>
              </TabPanel>
            </SwipeableViews>
          </div>
        </div>
      </div>
      <div className="Encoder-container">
        <div className="Encoder-pad">
          <div className="QR-container">
            <QRCode size={320} value={qrInput} />
          </div>
        </div>
      </div>
    </div>
  );
};
