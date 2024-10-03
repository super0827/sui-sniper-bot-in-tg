const axios = require("axios");
require('dotenv').config();
const { Telegraf, Markup, Input } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const desText = `
Welcome to SUI_sniper_bot, @`;
const cert = "Made with 💖 by Super Sniper who love you";
const waitMsg = "You'll get Token Info after a new token lunched.\n Thanks";
var prevPools;
var prevLen;

const getPools = async () => {
  const count = await axios.get("https://api-sui.cetus.zone/v2/sui/swap/count");
  return count?.data?.data?.pools || [];
};

const notifyPrice = async (chatId) => {
  try {
    const currPools = await getPools();
    const currLen = currPools.length;
    console.log("none new lunched -> ", currLen);
    if(currLen > prevLen){
      console.log("Ooohhh new lunched");
      prevLen = currLen;

      //------ compare logic ------
      const newPool = currPools.filter((curr) => !prevPools.some((prev) => curr.symbol == prev.symbol));
      //---------------------------

      const poolsMessage = `Total Lunched Token Count : \n\t${len}\nName : \n\t${JSON.stringify(newPool.name)}\nSymbol : \n\t${JSON.stringify(newPool.symbol)}\nPrice : \n\t${JSON.stringify(newPool.vol_usd)}\nSwap_account : \n\t${JSON.stringify(newPool.swap_account)}`; // Indent with 2 spaces
      await bot.telegram.sendMessage(chatId, `Good News:\n\`\`\`New_Lunched_Token_Info\n${poolsMessage}\`\`\``, { parse_mode: 'MarkdownV2' });
    }

  } catch (error) {
    console.error('Error fetching price:', error);
  }
};

bot.command("start", async (ctx) => {
  ctx.reply(`${desText}${ctx.from.username}\n${cert}\n\nYou can get Token Info to type "/info"`);
});

bot.command("info", async (ctx) => {
  console.log("waiting...");
  const chatId = ctx.chat.id;
  bot.telegram.sendMessage(chatId, `${waitMsg}`);
  const count = await axios.get("https://api-sui.cetus.zone/v2/sui/swap/count");
  prevLen = count?.data?.data?.pools?.length;
  prevPools = count;
  setInterval(() => notifyPrice(chatId), 5000);
});

// bot.start((ctx) => {
//   const username = ctx.from.username; // Get the username of the user
//   const firstName = ctx.from.first_name; // Get the first name of the user

//   // Check if username exists
//   if (username) {
//       ctx.reply(`Welcome ${firstName}! Your username is @${username}.`);
//   } else {
//       ctx.reply(`Welcome ${firstName}! You don't have a username set.`);
//   }
// });

bot.launch();