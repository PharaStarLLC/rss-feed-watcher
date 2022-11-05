/**
 * Copyright (c) 2022 | LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (C) 2022 | Pharaoh & Morningstar LLC team and contributors
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import FeedWatcher from './feedwatcher.js';

const FEED = 'https://www.reddit.com/r/news+minecraft+reddit+memes/new.rss';

(async () => {
    let watcher = new FeedWatcher(FEED, 10.64);

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
})();
