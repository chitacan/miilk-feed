import { Feed } from "npm:feed@4";
import { buildUrl } from "https://deno.land/x/url_builder/mod.ts";

const HOST = "https://themiilk.com/";
const CDN_HOST = "https://dsi523du1o5iq.cloudfront.net";

export function generateFeed(articles): string {
  const feedRoot = new Feed({
    title: "✨ 실리콘밸리 혁신 미디어 - 더밀크",
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
    console.log(
      article.hero_image_url,
      buildUrl(CDN_HOST, {
        path: ["fit-in", "320x0", article.hero_image_url],
      }))
    feedRoot.addItem({
      title: article.title,
      id: article.id,
      link: buildUrl(HOST, {
        path: ["articles", article.nickname],
      }),
      description: "",
      content: article.first_text,
      date: new Date(article.published_at),
      image: buildUrl(CDN_HOST, {
        path: ["fit-in", "320x0", article.hero_image_url],
      }),
      author: article.author_list.map((author) => {
        return { name: author.name };
      }),
    });
  });
  return feedRoot.json1();
}

if (import.meta.main) {
  const response = await fetch("https://themiilk.com/api/articles/main");
  const articles = await response.json().then((d) => Object.values(d).flat());
  const feed = generateFeed(articles);
  await Deno.writeTextFileSync("feed.json", feed);
}
