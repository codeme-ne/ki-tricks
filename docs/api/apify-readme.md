What does YouTube Scraper do?
YouTube Scraper extracts public data from YouTube pages, beyond what the YouTube Data API allows.

Find all kinds of data points in bulk, from video titles to their description to the metadata associated with them
Quickly discover vital points such as view count, number of comments, and snapshot the like counter
Can also break down playlists, streams, and search results
Export data in multiple formats: JSON, CSV, Excel, or HTML
Export via SDKs (Python & Node.js), use API Endpoints, webhooks, or integrate with workflows
How to use data scraped from YouTube
You can use this YouTube API to scrape data in order to:

Monitor the market: see mentions of your brand, the position of your content in search results
Use scraped profile data for lead generation, finding new opportunities your competitors haven’t discovered yet
Find current trends and opinions shared by content creators and commenting users
Get insights into competitors’ activity
Identify harmful or illegal content
Scrape subtitles which can be fed to AI and used to make your own scripts
Accumulate information on products and services from video reviews and automate your buying decisions
Filter your search results based on more advanced criteria
What data can you scrape from YouTube?
📺 Channel name	👍 Number of likes
📱 Social media links	💬 Comments count
📝 Video title	🔗 Video URL
🖍 Subtitles	📍 Channel location
📼 Total videos	🌐 Channel URL
👀 Number of views	👁️ Video view count
🧿 Total views	📈 Number of subscribers
⏱️ Duration	📅 Release date
#️⃣ Hashtags	📽️ Thumbnails
How to scrape YouTube data
YouTube Scraper is designed with users in mind. This means anybody can get started in just minutes, even if they’ve never scraped data before.

Create a free Apify account using your email.
Open YouTube Scraper.
Add one or more YouTube URLs or search terms
Click the “Start” button and wait for the data to be extracted.
Download your data in JSON, XML, CSV, Excel, or HTML.
⬇️ Input example
For input, you can either use the fields in Apify Console or enter it directly via JSON. You can also use this scraper locally — head over to the input schema tab for technical details.

You can scrape YouTube by search term or by direct URL and further refine your search by specifying whether you want to scrape full videos, shorts, or streams. You can also scrape subtitles from videos (this is done in a separate tab). Finally, it’s possible to also add filters and date ranges to searches.

YouTube Scraper input
🔗 How to scrape YouTube by URL or search term
Scraping by URL 🔗 will get you data from any video, channel, playlist, or search results. You can add as many URLs as you want.
Scraping by search term 🔑 will get you data from YouTube search results. You can add as many search terms as you want.
Scraping by URL	
Paste a YouTube link to a YouTube video, channel, playlist, or search results page. You can also import a CSV file or Google Sheet with a prepared list of URLs. Then choose how many results you would like to extract and click Start.

Scraping using search term	Type in keywords as you would normally do it in the YouTube search bar. Then choose how many results you would like to extract and click Start.
How to scrape YouTube shorts and streams
You determine the type of video you want to scrape through the main interface. In the fields that state the maximum number of each video type (regular videos, shorts, and streams), type 0 for each type you do not want to include. This also allows you to determine how many videos of each type to include in your search.

⚠️ Note that this filter only works when scraping by search term, not when scraping by URL.

YouTube Scraper video type
How to filter YouTube videos by date
There are two ways to filter by date, depending on whether you’re scraping videos by URL or by search term.

When scraping by search term

To filter videos by date when using search terms, go to the “Add filters” section, and then under “Sorting order” choose “Upload date.”

Alternatively, you can also select videos published in the last hour, day, week, month, or year by selecting the appropriate option under the “Date filter” menu.

YouTube Scraper date filter by search term
When scraping by URL

When scraping by URL, go to the input field that says “Date range (applicable only to scraping by channels URL).” There, type in (in absolute or relative numbers) by which date you want to filter the data and whether you want to sort the videos by newest, most popular, or oldest.

YouTube Scraper date filter by URL
How to scrape YouTube subtitles
You have two options if you want to scrape subtitles from YouTube videos. The simplest way is to click on the “Subtitles” toggle under the “Add filters” section of the input schema.

Alternatively, if you’re scraping by search term, you can go to the “Scraping subtitles” section and there switch on the toggles for “Download subtitles.” You can also save them to your Apify storages (for later use in other Actors or automations) by toggling “Save subtitles to key-value store.”

YouTube Scraper subtitles
⬆️ Output example
The scraped results will be shown as a dataset which you can find in the Storage tab. Note that the output is organized as a table for viewing convenience, but it doesn’t show all the fields:

YouTube Scraper output
You can preview all the fields and download the file with YouTube data in various formats (JSON, CSV, Excel, and more). Here’s a few JSON examples of different YouTube scraping cases:

💁‍♂️ Channel info
{
  "id": "HV6OlMPn5sI",
  "title": "Raimu - The Spirit Within 🍃 [lofi hip hop/relaxing beats]",
  "duration": "29:54",
  "channelName": "Lofi Girl",
  "channelUrl": "<https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow>",
  "date": "10 months ago",
  "url": "<https://www.youtube.com/watch?v=HV6OlMPn5sI>",
  "viewCount": 410458,
  "fromYTUrl": "<https://www.youtube.com/@LofiGirl/videos>",
  "channelDescription": "\\"That girl studying by the window non-stop\\"\\n\\n🎧 | Listen on Spotify, Apple music and more\\n→   <https://bit.ly/lofigirl-playlists\\n\\n💬> | Join the Lofi Girl community \\n→   <https://bit.ly/lofigirl-discord\\n→>   <https://bit.ly/lofigirl-reddit\\n\\n🌎> | Lofi Girl on all social media\\n→   <https://bit.ly/lofigirl-sociaI>",
  "channelDescriptionLinks": [
    {
        "text": "Discord",
        "url": "<https://discord.com/invite/hUKvJnw>"
    },
    
  ],
  "channelJoinedDate": "Mar 18, 2015",
  "channelLocation": "France",
  "channelTotalVideos": 409,
  "channelTotalViews": "1,710,167,563",
  "numberOfSubscribers": 13100000,
  "isMonetized": true,
  "inputChannelUrl": "<https://www.youtube.com/@LofiGirl/about>"
}

📹 A single video
{
  "title": "Stromae - Santé (Live From The Tonight Show Starring Jimmy Fallon)",
  "id": "CW7gfrTlr0Y",
  "url": "<https://www.youtube.com/watch?v=CW7gfrTlr0Y>",
  "thumbnailUrl": "<https://i.ytimg.com/vi/CW7gfrTlr0Y/maxresdefault.jpg>",
  "viewCount": 35582192,
  "date": "2021-12-21",
  "likes": 512238,
  "location": null,
  "channelName": "StromaeVEVO",
  "channelUrl": "<http://www.youtube.com/@StromaeVEVO>",
  "numberOfSubscribers": 6930000,
  "duration": "00:03:17",
  "commentsCount": 14,
  "text": "Stromae - Santé (Live From The Tonight Show Starring Jimmy Fallon on NBC)\\nListen to \\"La solassitude\\" here: <https://stromae.lnk.to/la-solassitude\\nOrder> my new album \\"Multitude\\" here: <https://stromae.lnk.to/multitudeID\\n--\\nhttps://www.stromae.com/fr/\\nhttps://www.tiktok.com/@stromae\\nhttps://www.facebook.com/stromae\\nhttps://www.instagram.com/stromae\\nhttps://twitter.com/stromae\\n> ",
  "descriptionLinks": [
    {
      "url": "<https://stromae.lnk.to/la-solassitude>",
      "text": "<https://stromae.lnk.to/la-solassitude>"
    },
    
  ],
  "subtitles": null,
  "comments": null,
  "isMonetized": true,
  "commentsTurnedOff": false
}

🎧 YouTube playlist
{
  "id": "CdgDLaxe2Q4",
  "title": "Lecture 4 | String Theory and M-Theory",
  "duration": "1:23:37",
  "channelName": "Stanford",
  "channelUrl": "<https://www.youtube.com/@stanford>",
  "date": "12 years ago",
  "url": "<https://www.youtube.com/watch?v=CdgDLaxe2Q4&list=PL6i60qoDQhQGaGbbg-4aSwXJvxOqO6o5e&index=100>",
  "viewCount": 106000,
  "fromYTUrl": "<https://www.youtube.com/playlist?list=PL6i60qoDQhQGaGbbg-4aSwXJvxOqO6o5e>"
},

🔎 YouTube search results
{
  "id": "CwRMBKk8St0",
  "title": "LET'S ARGUE: Beyoncé Fails the Bechdel Test!",
  "duration": "13:48",
  "channelName": "fantano",
  "channelUrl": "<https://www.youtube.com/@fantano>",
  "date": "5 years ago",
  "url": "<https://www.youtube.com/watch?v=CwRMBKk8St0>",
  "viewCount": 635379,
  "fromYTUrl": "<https://www.youtube.com/results?search_query=bechdel+test>"
},

YouTube subtitles
"subtitles": [
      {
        "srtUrl": "https://api.apify.com/v2/key-value-stores/WBeaA5MIHCBAR79Jy/records/subtitles_YmVqWiFEohY_en_auto_generated",
        "type": "auto_generated",
        "language": "en",
        "srt": "1\n00:00:0,320 --> 00:00:4,960\nEver feel like you've been chasing the\n\n2\n00:00:1,990 --> 00:00:4,960\n \n\n3\n00:00:2,000 --> 00:00:6,960\nwrong AI path? Look, I get it. I wasted\n\n4\n00:00:4,950 --> 00:00:6,960\n \n\n5\n00:00:4,960 --> 00:00:9,440\nmonths jumping from one trend to the\n\n6\n00:00:6,950 --> 00:00:9,440\n \n\n7\n00:00:6,960 --> 00:00:11,440\nnext, following outdated advice that\n\n8\n00:00:9,430 --> 00:00:11,440\n \n\n9\n00:00:9,440 --> 00:00:14,719\npromised quick results, but only left me\n\n10\n00:00:11,430 --> 00:00:14,719\n \n\n11\n00:00:11,440 --> 00:00:16,320\nstuck. In 2025, AI isn't about just\n\n12\n00:00:14,709 --> 00:00:16,320\n \n\n13\n00:00:14,719 --> 00:00:18,000\nlearning the basics. It's about\n\n14\n00:00:16,310 --> 00:00:18,000\n \n\n15\n00:00:16,320 --> 00:00:20,000\nmastering the skills companies are\n\n16\n00:00:17,990 --> 00:00:20,000\n \n\n17\n00:00:18,000 --> 00:00:22,240\ncrying out for right now. If I had to\n\n18\n00:00:19,990 --> 00:00:22,240\n \n\n19\n00:00:20,000 --> 00:00:24,960\nstart my AI journey over, I'd do it\n\n20\n00:00:22,230 --> 00:00:24,960\n \n\n21\n00:00:22,240 --> 00:00:26,640\ndifferently. I'd skip the fluff and dive\n\n22\n00:00:24,950 --> 00:00:26,640\n \n\n23\n00:00:24,960 --> 00:00:28,640\nstraight into what works in today's\n\n24\n00:00:26,630 --> 00:00:28,640\n \n\n25\n00:00:26,640 --> 00:00:31,480\nworld. And in this video, I'm sharing\n\n26\n00:00:28,630 --> 00:00:31,480\n \n\n27\n00:00:28,640 --> 00:00:34,239\nexactly how I'd learn AI from scratch in\n\n28\n00:00:31,470 --> 00:00:34,239\n \n\n29\n00:00:31,480 --> 00:00:36,160\n2025. No gimmicks, just actionable\n\"
      }
    ]

Need to scrape YouTube comments or Shorts?
If you want to extract specific YouTube data, you can use one of the specialized scrapers below:

💬 YouTube Comments Scraper
🏎 Fast YouTube Channel Scraper
▶️ YouTube Shorts Scraper
📽️ YouTube Video Scraper by Hashtag
📹 YouTube Video Downloader.
You can also combine YouTube data with that from other social networks. For example you can gather data with our other social media scrapers:

TikTok scrapers
Instagram scrapers
Facebook scrapers
You can also use AI agents to do multiple tasks at one. For example, our Comments Analyzer Agent can perform sentiment analysis of YouTube videos, or you could try our Influencer Discovery Agent for lead generation on TikTok videos.

❓FAQ
Can I scrape dislikes from YouTube videos?
No. Both dislike and details properties have been removed altogether from new versions. Dislikes are not public info so you cannot scrape them.

Can I scrape subtitles from YouTube videos?
Yes. You can scrape all publicly available data from YouTube using a web scraper, including subtitles. Using this scraping tool, you can extract both autogenerated and added subtitles in SRT, WEBVTT, XML, or plain text format.

How much will scraping YouTube cost you?
YouTube Scraper uses our price-per-result model. Currently, it costs $5.00 for 1,000 videos, giving you a price of $0.005 per result. For more information, visit the pricing tab.

How many videos can you scrape with YouTube Scraper?
YouTube Scraper can extract up to 20,000 videos per URL. However, you have to keep in mind that scraping youtube.com has many variables to it and may cause the results to fluctuate case by case. There’s no one-size-fits-all-use-cases number. The maximum number of results may vary depending on the complexity of the input, location, and other factors.

Therefore, while we regularly run scraper tests to keep the benchmarks in check, the results may also fluctuate without our knowing. The best way to know for sure for your particular use case is to do a test run yourself

Can I integrate this YouTube scraper with other apps?
YouTube Scraper can be connected with almost any cloud service or web app thanks to integrations on the Apify platform. These include Make, Zapier, Slack, Airbyte, GitHub, Google Drive, and plenty more.

Alternatively, you can use webhooks to carry out an action whenever an event occurs, e.g. get a notification whenever YouTube Scraper successfully finishes a run, or initiate a new process, like ordering your data.

Can I use YouTube Scraper with the API?
The Apify API gives you programmatic access to the Apify platform. The API is organized around RESTful HTTP endpoints that enable you to manage, schedule, and run Apify actors. The API also lets you access any datasets, monitor actor performance, fetch results, create and update versions, and more.

To access the API using Node.js, use the apify-client NPM package. To access the API using Python, use the apify-client PyPI package. Check out the Apify API reference docs for full details or click on the API tab for code examples.

Can I use YouTube Scraper through an MCP Server?
With Apify API, you can use almost any Actor in conjunction with an MCP server. You can connect to the MCP server using clients like ClaudeDesktop and LibreChat, or even build your own. Read all about how you can set up Apify Actors with MCP.

For YouTube Scraper, go to the MCP tab and then go through the following steps:

Start a Server-Sent Events (SSE) session to receive a sessionId
Send API messages using that sessionId to trigger the scraper
The message starts the Amazon ASINs Scraper with the provided input
The response should be: Accepted
Should I use a proxy when scraping YouTube?
Just like with other social media-related actors, using a proxy is essential if you want your scraper to run properly. You can either use your own proxy or stick to the default Apify Proxy servers. Datacenter proxies are recommended for use with this Actor.

Is it legal to scrape data from YouTube?
Scraping YouTube is legal as long as you adhere to regulations concerning copyright and personal data.

Personal data is protected by GDPR (EU Regulation 2016/679), and by other regulations around the world. You should not scrape personal data unless you have a legitimate reason to do so. If you're unsure whether your reason is legitimate, please consult your lawyers. You can also read our blog post on the legality of web scraping.

Your feedback
We're always working on improving the performance of our Actors. If you've got any technical feedback on YouTube Scraper, or simply found a bug, please create an issue on the Actor's Issues tab.