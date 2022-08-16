const config =
  process.env.NODE_ENV === "development"
    ? {
        URL_DRIVERS: "http://ergast.com/api/f1/2022/drivers.json",
        URL_CONSTRUCTORS: "http://ergast.com/api/f1/2022/constructors.json",
        CONTRACT_ADDRESS: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
      }
    : {};

export default config;
