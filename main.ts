import { Feed } from "npm:feed@4";
import { buildUrl } from "https://deno.land/x/url_builder/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

const args = parse(Deno.args);
const HOST = "https://themiilk.com";
const CDN_HOST = "https://dsi523du1o5iq.cloudfront.net";

export function generateFeed(articles): string {
  const feedRoot = new Feed({
    title: "더밀크",
    description:
      "실리콘밸리 혁신 미디어. 더밀크는 미래 산업의 인사이트와 미국 주식 정보를 전달합니다.",
    link: HOST,
    image: "https://assets.themiilk.com/favicon/apple-touch-icon.png",
    favicon: "https://assets.themiilk.com/favicon/favicon.ico",
    updated: new Date(),
    feedLinks: {
      json: "",
    },
    author: {
      name: "chitacan",
      email: "chitacan@gmail.com",
      link: "https://github.com/chitacan",
    },
  });

  articles.forEach((article) => {
    feedRoot.addItem({
      title: article.title,
      id: buildUrl(HOST, {
        path: ["articles", article.article_id],
      }),
      link: buildUrl(HOST, {
        path: ["articles", article.nickname],
      }),
      content: article.sub_title,
      date: new Date(article.published_at),
      image: buildUrl(CDN_HOST, {
        path: ["fit-in", "320x0", article.hero_image_url],
      }),
      author: article.author_list?.map((author) => {
        return { name: author.name };
      }),
    });
  });
  return feedRoot.json1();
}

if (!import.meta.main) {
  Deno.exit(0);
}

if (args["help"]) {
  console.log(`
  Usage
    $ deno run -A main.ts

  Options
    --write-response  write response in "response.json" file
`);
  Deno.exit(0);
}

const response = await fetch("https://themiilk.com/api/articles/main");
const articles = await response.json().then(async (d) => {
  if (args["write-response"]) {
    await Deno.writeTextFileSync("response.json", JSON.stringify(d, null, 2));
    console.log("response created in 'response.json' file.");
  }
  return Object.values(d).flat();
});
const feed = generateFeed(articles);
await Deno.writeTextFileSync("feed.json", feed);
console.log("feed created in 'feed.json' file.");
