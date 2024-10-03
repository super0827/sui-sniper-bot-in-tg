const axios = require("axios");
require('dotenv').config();
const { Telegraf, Markup, Input } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const welcomeMsg = `🚀 Welcome to SUI_Sniper_Bot, @`;
const infoMsg = `Our innovative bot is designed to enhance your token management by monitoring new lunched SUI token. 💡\n
With SUI Sniper Bot, navigating complex decisions becomes effrotless and manage New Tokens easily. 🌟`;
const guideMsg = `Follow /info to get New Token Info`;
const cert = "Made with 💖 by Super Sniper who love you";
const waitMsg = "You'll get Token Info when a new token lunched.\nPlease wait...";
var prevPools = [];
var prevLen;

const getPools = async () => {
  const count = await axios.get("https://api-sui.cetus.zone/v2/sui/swap/count");
  return count?.data?.data?.pools || [];
};

const notifyPrice = async (chatId) => {
  try {
    const currPools = await getPools();
    const currLen = currPools.length;
    console.log("none new lunched : ", "currLen -> ", currLen, " prevLen -> ", prevLen) ;
    if(currLen > prevLen){
      console.log("Ooohhh new lunched");
      prevLen = currLen;
      const newPool = currPools.filter((curr) => !prevPools.some((prev) => curr.symbol == prev.symbol));
      for(let i = 0; i < newPool.length ; i++){
        const poolsMessage = `Total Lunched Token Count : \n\t${currLen - newPool.length + i + 1}\nName : \n\t${JSON.stringify(newPool[i].name)}\nSymbol : \n\t${JSON.stringify(newPool[i].symbol)}\nPrice : \n\t${JSON.stringify(newPool[i].vol_usd)}\nSwap_account : \n\t${JSON.stringify(newPool[i].swap_account)}`; // Indent with 2 spaces
        await bot.telegram.sendMessage(chatId, `Good News:\n\`\`\`New_Lunched_Token_Info\n${poolsMessage}\`\`\``, { parse_mode: 'MarkdownV2' });
      }
      prevPools = currPools;
    }
  } catch (error) {
    console.error('Error fetching price:', error);
  }
};

bot.command("start", async (ctx) => {
  ctx.reply(`${welcomeMsg}${ctx.from.username}!\n\n${infoMsg}\n\n${guideMsg}\n\n${cert}`);
});

bot.command("info", async (ctx) => {
  console.log("waiting...");
  const chatId = ctx.chat.id;
  bot.telegram.sendMessage(chatId, `${waitMsg}`);
  const count = await axios.get("https://api-sui.cetus.zone/v2/sui/swap/count");
  prevLen = count?.data?.data?.pools?.length;
  prevPools = count?.data?.data?.pools;
  setInterval(() => notifyPrice(chatId), 5000);
});

bot.launch();