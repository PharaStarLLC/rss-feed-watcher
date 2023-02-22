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

import { EventEmitter } from 'node:events';
import FeedParser from 'feedparser';
import fetch from 'node-fetch';

export default class FeedWatcher extends EventEmitter {
    /**
     * TODO: better docs...
     * @param { String } feedUrl
     * @param { Number } interval
     */
    constructor(feedUrl, interval = 10) {
        super();
        if (!feedUrl || feedUrl == '') throw new Error('Feed url cannot be empty or null');
        if (interval < 1) throw new Error('interval cannot be less than 1');
        this._feed = feedUrl;
        this._interval = interval;
    }

    async _req() {
        return new Promise(async (resolve, reject) => {
            let response = await fetch(this._feed).catch(reject);

            if (!response || response.status !== 200) {
                return reject(new Error('Bad status code'));
            }

            let feedparser = new FeedParser({
                addmeta: true,
                normalize: true,
                feedurl: this._feed,
                MAX_BUFFER_LENGTH: 4096
            });

            feedparser.on('error', reject);
            var items = [];
            feedparser.on('readable', function () {
                var stream = this
                var item;
                try {
                    while (null !== (item = stream.read())) {
                        items.push(item);
                    }
                } catch (error) {}
            });
            feedparser.on('end', () => {
                resolve(items);
            });

            response.body.pipe(feedparser);
        });
    }

    /**
     * Starts the watcher by your given interval in seconds.
     * The new data will be resolved as "data" event (Array<Object>)
     * @returns { Promise<Array<Object>> } initialEntries
     */
    async start() {
        return new Promise(async (resolve, reject) => {
            let currentEntries = await this._req().catch(reject);

            this.lastEntryDate = currentEntries[0].pubDate / 1000;
            this.lastEntryTitle = currentEntries[0].title;

            this._check = setInterval(async () => {
                currentEntries = (await this._req().catch(() => {})) || [];
                const newEntries = currentEntries.filter((entry) => {
                    return this.lastEntryDate === null || this.lastEntryDate < entry.pubDate / 1000;
                });
                if (newEntries.length > 0) {
                    this.lastEntryDate = newEntries[0].pubDate / 1000;
                    this.lastEntryTitle = newEntries[0].title;
                    this.emit('data', newEntries);
                }
            }, this._interval * 1000);

            resolve(currentEntries);
        });
    }

    /**
     * Stops the FeedWatcher interval
     */
    async stop() {
        if (this._check) {
            clearInterval(this._check);
            this._check = null;
        }
    }
}
