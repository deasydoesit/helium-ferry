import React, { ReactElement, ChangeEvent, useState } from 'react';
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
import InputLabel from '@material-ui/core/InputLabel';
import { a11yProps, timeout } from './utils';
import { TabPanelProps } from './types';
import './Encoder.css';

interface CliPaymentObj {
  type?: string;
  oldOwner?: string;
  newOwner?: string;
  newValidator?: string;
  oldValidator?: string;
  validator?: string;
  address?: string;
  stakeAmount?: string;
  transaction?: string;
  stakeReleaseHeight?: string;
  amount?: string;
  fee?: string;
  nonce?: string;
}

export const Encoder = (): ReactElement => {
  const [isEncoding, setIsEncoding] = useState(false);
  const [tab, setTab] = useState(0);
  const [txnType, setTxnType] = useState<string>('');
  const [freeform, setFreeform] = useState<string>('');
  const [qrInput, setQrInput] = useState<string>('heliumferry.com');
  // payment
  const [payee, setPayee] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [nonce, setNonce] = useState<string>('');
  const [paymentFee, setPaymentFee] = useState<string>('35000');
  // stake / unstake
  const [validator, setValidator] = useState<string>('');
  const [stakeReleaseHeight, setStakeReleaseHeight] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState<string>('10000');
  const [stakeFee, setStakeFee] = useState<string>('35000');
  const [unstakeFee, setUnstakeFee] = useState<string>('35000');
  // transfer accept
  const [transaction, setTransaction] = useState<string>('');
  // transfer create
  const [newValidator, setNewValidator] = useState<string>('');
  const [oldValidator, setOldValidator] = useState<string>('');
  const [newOwner, setNewOwner] = useState<string>('');
  const [oldOwner, setOldOwner] = useState<string>('');
  const [transferFee, setTransferFee] = useState<string>('55000');
  const theme = useTheme();

  const resetVals = () => {
    setFreeform('');
    setPayee('');
    setAmount('');
    setNonce('');
    setPaymentFee('35000');
    setValidator('');
    setStakeAmount('10000');
    setStakeFee('35000');
    setUnstakeFee('35000');
    setTransaction('');
    setNewValidator('');
    setOldValidator('');
    setNewOwner('');
    setOldOwner('');
    setTransferFee('55000');
  };

  const handleChangeTab = (event: ChangeEvent<{}>, newValue: number) => {
    resetVals();
    setTab(newValue);
  };

  const handleChangeTabIndex = (index: number) => {
    resetVals();
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

  const handleCreateFreeformQr = async (): Promise<void> => {
    setIsEncoding(true);
    await timeout(1000);
    setQrInput(freeform);
    setIsEncoding(false);
  };

  const handleCliCommandQr = async (): Promise<void> => {
    const obj: CliPaymentObj = {};
    obj.type = txnType;
    if (txnType === 'payment') {
      obj.address = payee;
      obj.amount = amount;
      obj.nonce = nonce;
      obj.fee = paymentFee;
    }
    if (txnType === 'stake') {
      obj.validator = validator;
      obj.stakeAmount = stakeAmount;
      obj.fee = stakeFee;
    }
    if (txnType === 'unstake') {
      obj.validator = validator;
      obj.stakeReleaseHeight = stakeReleaseHeight;
      obj.stakeAmount = stakeAmount;
      obj.fee = unstakeFee;
    }
    if (txnType === 'transfer accept') {
      obj.transaction = transaction;
    }
    if (txnType === 'transfer create') {
      obj.amount = amount;
      obj.oldOwner = oldOwner;
      obj.newOwner = newOwner;
      obj.oldValidator = oldValidator;
      obj.newValidator = newValidator;
      obj.stakeAmount = stakeAmount;
      obj.fee = transferFee;
    }
    const stringifiedObj = JSON.stringify(obj);
    setIsEncoding(true);
    await timeout(1000);
    setQrInput(stringifiedObj);
    setIsEncoding(false);
  };

  const isSubmitDisabled = (): boolean => {
    if (tab === 0) {
      if (freeform) return false;
    }
    if (txnType === 'payment') {
      if (payee && amount && nonce && paymentFee) return false;
    }
    if (txnType === 'stake') {
      if (validator && stakeAmount && stakeFee) return false;
    }
    if (txnType === 'unstake') {
      if (validator && stakeAmount && unstakeFee && stakeReleaseHeight) return false;
    }
    if (txnType === 'transfer accept') {
      if (transaction) return false;
    }
    if (txnType === 'transfer create') {
      if (oldValidator && newValidator && stakeAmount && transferFee) return false;
    }
    return true;
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
                          defaultValue={freeform}
                          onBlur={(event: any) => setFreeform(event.target.value)}
                        />
                      </div>
                    </div>
                    <div className="QR-button-container">
                      <Button
                        className="QR-button"
                        variant="contained"
                        size="large"
                        color="inherit"
                        onClick={handleCreateFreeformQr}
                        disabled={isEncoding || isSubmitDisabled()}
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
                  <div className="Txn-type-select-select-container">
                    <FormControl className="Form-control" variant="outlined" required>
                      <InputLabel htmlFor="Txn-type-select" id="Txn-type-select-label">
                        Transaction Type
                      </InputLabel>
                      <Select
                        labelId="Txn-type-select-label"
                        id="Txn-type-select"
                        className="Network-select-selector"
                        value={txnType}
                        label="Transaction Type"
                        onChange={(event) => {
                          resetVals();
                          setTxnType(event.target.value as string);
                        }}
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
                        variant="outlined"
                        defaultValue={payee}
                        onBlur={(event: any) => setPayee(event.target.value)}
                      />
                      <div className="Amounts-container">
                        <TextField
                          required
                          id="amount"
                          className="amount-field"
                          label="Amount"
                          variant="outlined"
                          defaultValue={amount}
                          onBlur={(event: any) => setAmount(event.target.value)}
                        />
                        <TextField
                          required
                          id="fee"
                          className="fee-field"
                          label="Fee"
                          variant="outlined"
                          defaultValue={paymentFee}
                          onBlur={(event: any) => setPaymentFee(event.target.value)}
                        />
                        <TextField
                          required
                          id="nonce"
                          className="nonce-field"
                          label="Nonce"
                          variant="outlined"
                          defaultValue={nonce}
                          onBlur={(event: any) => setNonce(event.target.value)}
                        />
                      </div>
                    </>
                  )}
                  {txnType === 'stake' && (
                    <>
                      <TextField
                        required
                        id="validator"
                        className="validator-field"
                        label="Validator Address"
                        variant="outlined"
                        defaultValue={validator}
                        onBlur={(event: any) => setValidator(event.target.value)}
                      />
                      <div className="Amounts-container">
                        <TextField
                          required
                          id="amount"
                          className="amount-field"
                          label="Stake Amount"
                          variant="outlined"
                          defaultValue={stakeAmount}
                          onBlur={(event: any) => setStakeAmount(event.target.value)}
                        />
                        <TextField
                          required
                          id="fee"
                          className="fee-field"
                          label="Fee"
                          variant="outlined"
                          defaultValue={stakeFee}
                          onBlur={(event: any) => setStakeFee(event.target.value)}
                        />
                      </div>
                    </>
                  )}
                  {txnType === 'unstake' && (
                    <>
                      <TextField
                        required
                        id="validator"
                        className="validator-field"
                        label="Validator Address"
                        variant="outlined"
                        defaultValue={validator}
                        onBlur={(event: any) => setValidator(event.target.value)}
                      />
                      <div className="Amounts-container">
                        <TextField
                          required
                          id="amount"
                          className="amount-field"
                          label="Stake Amount"
                          variant="outlined"
                          defaultValue={stakeAmount}
                          onBlur={(event: any) => setStakeAmount(event.target.value)}
                        />
                        <TextField
                          required
                          id="stakeReleaseHeight"
                          className="release-field"
                          label="Release Height"
                          variant="outlined"
                          defaultValue={stakeReleaseHeight}
                          onBlur={(event: any) => setStakeReleaseHeight(event.target.value)}
                        />
                        <TextField
                          required
                          id="fee"
                          className="fee-field"
                          label="Fee"
                          variant="outlined"
                          defaultValue={unstakeFee}
                          onBlur={(event: any) => setUnstakeFee(event.target.value)}
                        />
                      </div>
                    </>
                  )}
                  {txnType === 'transfer accept' && (
                    <TextField
                      required
                      multiline
                      rows={8}
                      id="transaction"
                      className="transaction-field"
                      label="Transaction"
                      variant="outlined"
                      defaultValue={transaction}
                      onBlur={(event: any) => setTransaction(event.target.value)}
                    />
                  )}
                  {txnType === 'transfer create' && (
                    <>
                      <TextField
                        required
                        id="oldValidator"
                        className="validator-field"
                        label="Old Validator"
                        variant="outlined"
                        defaultValue={oldValidator}
                        onBlur={(event: any) => setOldValidator(event.target.value)}
                      />
                      <TextField
                        required
                        id="newValidator"
                        className="validator-field"
                        label="New Validator"
                        variant="outlined"
                        defaultValue={newValidator}
                        onBlur={(event: any) => setNewValidator(event.target.value)}
                      />
                      <TextField
                        id="oldOwner"
                        className="owner-field"
                        label="Old Owner"
                        variant="outlined"
                        defaultValue={oldOwner}
                        onBlur={(event: any) => setOldOwner(event.target.value)}
                      />
                      <TextField
                        id="newOwner"
                        className="owner-field"
                        label="New Owner"
                        variant="outlined"
                        defaultValue={newOwner}
                        onBlur={(event: any) => setNewOwner(event.target.value)}
                      />
                      <div className="Amounts-container">
                        <TextField
                          required
                          id="amount"
                          className="amount-field"
                          label="Stake Amount"
                          variant="outlined"
                          defaultValue={stakeAmount}
                          onBlur={(event: any) => setStakeAmount(event.target.value)}
                        />
                        <TextField
                          required
                          id="fee"
                          className="fee-field"
                          label="Fee"
                          variant="outlined"
                          defaultValue={transferFee}
                          onBlur={(event: any) => setTransferFee(event.target.value)}
                        />
                      </div>
                    </>
                  )}
                  {txnType && (
                    <div className="QR-button-container">
                      <Button
                        className="QR-button"
                        variant="contained"
                        size="large"
                        color="inherit"
                        onClick={() => handleCliCommandQr()}
                        disabled={isEncoding || isSubmitDisabled()}
                      >
                        Encode
                      </Button>
                      {isEncoding && <CircularProgress size={24} className="Encoding-progress" />}
                    </div>
                  )}
                </div>
              </TabPanel>
            </SwipeableViews>
          </div>
        </div>
      </div>
      <div className="Encoder-container">
        <div className={`Encoder-pad ${isEncoding ? 'encoding' : ''}`}>
          <div className="QR-container">
            <QRCode size={320} value={qrInput} />
          </div>
          {isEncoding && <CircularProgress size={75} className="Encoding-progress" />}
        </div>
      </div>
    </div>
  );
};
