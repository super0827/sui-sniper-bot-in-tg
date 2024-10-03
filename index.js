const axios = require("axios");

const getPools = async () => {
  const count = await axios.get("https://api-sui.cetus.zone/v2/sui/swap/count");
  console.log(count.data.data.pools[1]);
  return count.data.data.pools;
};



getPools();
