
/** @type {import("cloudstream").Plugin} */
module.exports = new Extension({
  name: "Onlineserietv",
  description: "Contenuti da onlineserietv.com",
  version: "1.0.0",
  language: ["it"],
  icon: "https://www.onlineserietv.com/favicon.ico",
  domains: ["onlineserietv.com"],
  async load() {
    registerAnime({
      name: "Onlineserietv",
      baseUrl: "https://www.onlineserietv.com",
      getAnimeList: async () => {
        const doc = await fetchDocument("https://www.onlineserietv.com/");
        return doc.selectAll("div.serie-card, div.card").map(el => {
          const title = el.selectFirst("h3")?.text() || el.selectFirst("h2")?.text();
          const url = el.selectFirst("a")?.attr("href");
          const img = el.selectFirst("img")?.attr("src");
          if (!url || !title) return null;
          return { title, url, image: img };
        }).filter(Boolean);
      },
      getAnimeInfo: async (url) => {
        const doc = await fetchDocument(url);
        return {
          title: doc.selectFirst("h1")?.text() ?? "Senza titolo",
          episodes: [{
            name: "Guarda ora",
            url,
          }],
        };
      },
      getVideoLinks: async (url) => {
        const doc = await fetchDocument(url);
        const iframe = doc.selectFirst("iframe")?.attr("src");

        if (!iframe) return [];

        return [{
          url: iframe,
          quality: "Auto",
          isM3U8: iframe.includes(".m3u8"),
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Referer": "https://www.onlineserietv.com/",
          },
        }];
      },
    });
  },
});
