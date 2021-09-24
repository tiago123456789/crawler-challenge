
import dotenv from "dotenv"
dotenv.config();

import { cache } from "./../utils/Cache";
import Crawler, { CrawlerInterface } from "./../crawler/Crawler";
import logger from "./../config/Logger"
import { App } from "../constants/App";

const crawler: CrawlerInterface = new Crawler(cache, logger);

(async () => {
    await crawler.action()
    setInterval(async() => { await crawler.action(); }, App.TIME_INTERVAL_JOB_EXECUTE)
})()