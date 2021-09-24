// import * as nodeSchedule from "node-schedule";
// import AbstractScheduler from "./schedulers/AbstractScheduler";

// // nodeSchedule.scheduleJob(crawlerScheduler.timeExecution(), crawlerScheduler.action)
// (async () => {
//     await crawlerScheduler.action();
//     console.log("==========================")
//     await crawlerScheduler.action();
//     console.log("==========================")
//     await crawlerScheduler.action();

// })()

import dotenv from "dotenv"

dotenv.config();

import { cache } from "./utils/Cache";
import Crawler, { CrawlerInterface } from "./crawler/Crawler";
import logger from "./config/Logger"

const crawler: CrawlerInterface = new Crawler(cache, logger);

(async () => {
    await crawler.action()
    const millesecondsThe6Hours = (21600 * 1000)
    setInterval(async() => { await crawler.action(); }, millesecondsThe6Hours)
})()

