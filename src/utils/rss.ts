import fs from "fs"
import { Feed, FeedOptions } from "feed"
import { getAllPosts } from "@/lib/notion"
import { SITE_URL, siteConfig } from "@/config"
import { parseISO } from "date-fns"

export async function generateRssFeed() {
  const posts = await getAllPosts({ includePages: false })

  if (!SITE_URL){
    throw new Error("Missing SITE_URL in env file")
  }
  
  if (!posts){
    throw new Error("Failed to fetch posts")
  }

  const feedOptions: FeedOptions = {
    title: siteConfig.name,
    description: siteConfig.description,
    id: SITE_URL,
    link: SITE_URL,
    favicon: `${SITE_URL}/favicon.svg`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${
      siteConfig.name
    }`,
    feedLinks: {
      rss2: `${SITE_URL}/rss.xml`,
    },
  }

  const feed = new Feed(feedOptions)

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.slug}`,
      link: `${SITE_URL}/blog/${post.slug}`,
      description: post.summary,
      date: parseISO(post.createdTime),
    })
  })

  fs.writeFileSync("./public/rss.xml", feed.rss2())
}
