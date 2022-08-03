const config =
  process.env.NODE_ENV === "development"
    ? {
        URL_DRIVERS: "http://ergast.com/api/f1/2022/drivers.json",
      }
    : {};

export default config;
