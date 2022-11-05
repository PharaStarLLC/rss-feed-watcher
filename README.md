# @pharastar/rss-feed-watcher

---

## Install Commnd `npm i --save @pharastar/rss-feed-watcher`

### Import NodeJS

```js
const FeedWatcher = require('@pharastar/rss-feed-watcher');
```

---

#### Listen for new entries in RSS feeds

```js
const FEED = 'https://www.reddit.com/r/news+minecraft+reddit+memes/new.rss'; // Feed URL
const UPDATE_INTERVAL = 10; // interval in seconds

let watcher = new FeedWatcher(FEED, UPDATE_INTERVAL);

watcher.on('data', (entries) => {
    console.log(entries.map((e) => e.link));
});

watcher
    .start()
    .then((initials) => {
        console.log(initials.map((i) => i.link));
    })
    .catch(console.error);

setTimeout(watcher.stop, 50000);
```

---
