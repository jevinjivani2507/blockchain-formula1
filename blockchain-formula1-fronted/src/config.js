const config =
  process.env.NODE_ENV === "development"
    ? {
        URL_DRIVERS: "http://ergast.com/api/f1/2022/drivers.json",
        URL_CONSTRUCTORS: "http://ergast.com/api/f1/2022/constructors.json",
      }
    : {};

export default config;
