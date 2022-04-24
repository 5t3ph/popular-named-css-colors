require("dotenv").config();
const fs = require("fs");
const path = require("path");
const tinycolor = require("tinycolor2");
const { TwitterApi } = require("twitter-api-v2");

const colors = async () => {
  const userClient = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
  });

  const client = await userClient.appLogin();

  let replySearch = await client.v1.get(
    "search/tweets.json?q=(to%3A5t3ph)%20until%3A2022-04-22%20since%3A2022-04-21%20filter%3Areplies"
  );

  let allReplies = [];
  while (replySearch.search_metadata.next_results !== undefined) {
    allReplies.push(replySearch.statuses);
    replySearch = await client.v1.get(
      `search/tweets.json${replySearch.search_metadata.next_results}`
    );
  }

  const allColors = [];
  for (let reply of allReplies.flat()) {
    const text = reply.text.replaceAll(/\n/gm, " ");

    let words = text.split(" ");

    // check each word to find valid named color
    for (let word of words) {
      const color = tinycolor(word);
      if (color.isValid() && color.getFormat() === "name") {
        allColors.push(word.toLowerCase());
      }
    }
  }

  let colorsFilePath = path.resolve(__dirname, fs.realpathSync("src/_data"));
  if (!fs.existsSync(colorsFilePath)) {
    console.log("Invalid directory provided");
    process.exit(1);
  }
  fs.writeFileSync(`${colorsFilePath}/colors.json`, JSON.stringify(allColors), {
    flag: "w",
  });
};

colors();
