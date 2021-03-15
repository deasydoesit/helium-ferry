import React, { ReactElement, useState, useRef } from 'react';
import QrReader from 'react-qr-reader';
import axios from 'axios';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import FormControl from '@material-ui/core/FormControl';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import './Scanner.css';

const NETWORKS: { [key: string]: any } = {
  test: 'https://testnet-api.helium.wtf/v1/pending_transactions/',
  main: 'https://api.helium.io/v1/pending_transactions/',
};

interface ResponseType {
  data: {
    hash: string;
  };
}

interface ResultsType {
  hash: string;
  network: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

const a11yProps = (index: any) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
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

export const Scanner = (): ReactElement => {
  const [submissionResults, setSubmissionResults] = useState<ResultsType[]>([]);
  const [scanResult, setScanResult] = useState<string | undefined>(undefined);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('');
  const [isNoNetwork, setIsNoNetwork] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>('');
  const [tab, setTab] = React.useState(0);
  const theme = useTheme();
  const cameraRef = useRef<any>(null);

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const handleChangeTabIndex = (index: number) => {
    setTab(index);
  };

  const handleScan = (data: string | null): void => {
    if (data) {
      setScanResult(data);
      const node = cameraRef.current;
      if (node) node.stopCamera();

      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setIsScannerOpen(false);
      }, 500);
    }
  };

  const handleError = (err: string): void => {
    console.error(err);
  };

  const handleToastClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    if (isNoNetwork) setIsNoNetwork(false);
    if (isError) setIsError(false);
    if (isSuccess) setIsSuccess(false);
    setToastText('');
  };

  const determineSubmitLabel = (): ReactElement => {
    let label = <></>;
    if (!isSuccess) {
      label = <>Submit</>;
    }
    if (isSuccess) {
      label = <CheckIcon />;
    }
    if (isError) {
      label = <CloseIcon />;
    }
    return label;
  };

  const handleSubmit = async (): Promise<void> => {
    const timeout = (delay: number) => {
      return new Promise((res) => setTimeout(res, delay));
    };

    if (network === '') {
      setToastText('Error: Please specify a network (e.g., testnet or mainnet).');
      setIsNoNetwork(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await timeout(1000);

      const response = await axios.post<ResponseType>(
        'https://0eythmyf76.execute-api.us-east-1.amazonaws.com/production/submit',
        {
          txn: scanResult,
          networkType: network,
        },
      );
      setIsSubmitting(false);
      setIsSuccess(true);

      if (response && response.data && response.data.data && response.data.data.hash) {
        await timeout(2000);
        const tmpRes: ResultsType[] = [
          { hash: response.data.data.hash, network: NETWORKS[network] },
          ...submissionResults,
        ];
        console.log(tmpRes);
        setSubmissionResults(tmpRes);
        setIsSuccess(false);
        setIsSubmitDisabled(true);
      }
    } catch (err) {
      let helperText = 'Hmmm, something went wrong..';
      if (err.message === 'Network Error')
        helperText = `${err.message} - Are you connected to the internet?`;
      if (err.message === 'Request failed with status code 400')
        helperText = 'Internal server error - Something went wrong submitting to the Helium API.';
      setToastText(`Error: ${helperText}`);
      setIsSubmitting(false);
      setIsError(true);
    }
  };

  return (
    <div className="Scanner-root">
      {isScanning && <CircularProgress className="Spinner" />}
      <div id="camera" className={`Scanner-view ${scanResult && 'kill'}`}>
        <div className="Scanner-pad">
          <div className="Scanner-container">
            <QrReader
              ref={cameraRef}
              className="Scanner"
              delay={300}
              onError={handleError}
              onScan={(data: string | null) => handleScan(data)}
              style={{ width: '80%' }}
            />
          </div>
          <div className="Instruction-container">
            <Typography component={'span'} className="Instruction-header" variant="h6">
              Scan the QR code representing your base64 encoded, signed Helium transaction
            </Typography>
          </div>
        </div>
      </div>
      {!isScannerOpen && !isScanning && (
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
              <Tab className="Review-tab" label="Review" {...a11yProps(0)} />
              <Tab
                className="Submissions-tab"
                disabled={submissionResults.length === 0}
                label={
                  <div>
                    Submission
                    <Badge color="secondary" badgeContent={submissionResults.length}></Badge>
                  </div>
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <SwipeableViews
            className="Panel-container"
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={tab}
            onChangeIndex={handleChangeTabIndex}
          >
            <TabPanel value={tab} index={0} dir={theme.direction}>
              <div className="Transaction-view">
                <div className="Transaction-card">
                  <div className="Transaction-header-container">
                    <Typography className="Transaction-header" variant="h6">
                      Transaction Review
                    </Typography>
                  </div>
                  <div className="Transaction-body">
                    <div className="Network-select-container">
                      <div className="Network-select-label-container">
                        <label htmlFor="Network-select" id="Network-select-label">
                          Network
                        </label>
                      </div>
                      <div className="Network-select-select-container">
                        <FormControl className="Form-control" error={isNoNetwork}>
                          <Select
                            labelId="Network-select-label"
                            id="Network-select"
                            className="Network-select-selector"
                            value={network}
                            onChange={(event) => setNetwork(event.target.value as string)}
                          >
                            <MenuItem value={'test'}>Testnet</MenuItem>
                            <MenuItem value={'main'}>Mainnet</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="B64-container">
                      <div className="B64-label">Txn</div>
                      <div className="B64-data">{scanResult}</div>
                    </div>
                  </div>
                  <div className="Transaction-button-container">
                    <Button
                      className={`Transaction-button ${isSuccess && 'bg-green'} ${
                        isError && 'bg-red'
                      }`}
                      variant="contained"
                      size="large"
                      color="inherit"
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting || isSubmitDisabled}
                    >
                      {determineSubmitLabel()}
                    </Button>
                    {isSubmitting && (
                      <CircularProgress size={24} className="Transaction-progress" />
                    )}
                  </div>
                  <a className="anchor-reset" href="/scanner">
                    <span className="Scan-again">Scan again</span>
                  </a>
                </div>
              </div>
            </TabPanel>
            <TabPanel value={tab} index={1} dir={theme.direction}>
              <div className="Submission-view">
                {submissionResults.map((result, i) => (
                  <a
                    key={`${result.hash}-${i}`}
                    className="anchor-reset"
                    href={`${result.network}${result.hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="Submission-container">
                      <div className="Submission-header">{i + 1}</div>
                      <div className="Submission-result">
                        <div className="Submission">{result.hash}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </TabPanel>
          </SwipeableViews>
        </div>
      )}
      <Snackbar open={isNoNetwork || isError} autoHideDuration={6000} onClose={handleToastClose}>
        <Alert variant="filled" onClose={handleToastClose} severity="error">
          {toastText}
        </Alert>
      </Snackbar>
      <Snackbar open={isSuccess} autoHideDuration={6000} onClose={handleToastClose}>
        <Alert variant="filled" onClose={handleToastClose} severity="success">
          Successfully submitted transaction to {network}!
        </Alert>
      </Snackbar>
    </div>
  );
};