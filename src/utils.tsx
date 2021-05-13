export const a11yProps = (index: any) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
};

export const timeout = (delay: number) => {
  return new Promise((res) => setTimeout(res, delay));
};
