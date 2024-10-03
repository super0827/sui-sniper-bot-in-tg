const axios = require("axios");
require('dotenv').config();
const { Telegraf, Markup, Input } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const desText = `
This is a SUI_sniper_bot.
`;

const cert = "Made with 💖 by Super Sniper";

const getPools = async () => {
  const count = await axios.get("https://api-sui.cetus.zone/v2/sui/swap/count");
  // console.log(count.data.data.pools[1]);
  return count.data.data.pools;
};

const notifyPrice = async (chatId) => {
  try {
    const pools = await getPools();
    // const poolsMessage = pools.map((pool, index) => {
    //   return `Pool ${index + 1}:\nPrice: ${pool.price}\nOther Info: ${JSON.stringify(pool.otherInfo)}\n\n`; // Adjust according to the actual structure
    // }).join('');
    const poolsMessage = pools[1].price;

    await bot.telegram.sendMessage(chatId, `Pools:\n${poolsMessage}`);
  } catch (error) {
    console.error('Error fetching price:', error);
  }
};

bot.command("start", async (ctx) => {
  ctx.reply(`${desText}\n${cert}\n\nYou can get Token Info to type "/info"`);
});

bot.command("info", async (ctx) => {
  const chatId = ctx.chat.id;
  bot.telegram.sendMessage(chatId, "You'll get Token Info every 1 min.\n Thanks");
  setInterval(() => notifyPrice(chatId), 10000);
});


bot.launch();