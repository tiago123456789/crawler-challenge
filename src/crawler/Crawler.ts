import puppeteer from "puppeteer"
import axios from "axios";
import cheerio from "cheerio";
import { CacheInterface } from "../utils/Cache";
import { Logger } from "winston";
const agents = require("./../../agents.json")


export interface CrawlerInterface {
    action(): { [key: string]: any }
} 

export default class Crawler implements CrawlerInterface {

    private readonly URL = "https://www.netshoes.com.br/tenis-nike-air-max-impact-2-preto+branco-HZM-4286-026";
    private readonly KEY_CACHE = "tenis-nike-air-max-impact-2-preto+branco-HZM-4286-026";
    private readonly TIME_EXPIRATION_CACHE_IN_SECONDS = (22600 * 1000)

    constructor(private readonly cache: CacheInterface, private readonly logger: Logger) { }

    private getUserAgent() {
        const valueBetween0And1000 = Math.floor(Math.random() * 1000);
        return agents[valueBetween0And1000]
    }

    async action() {
        try {
            this.logger.info("Initing extraction data in netshoes")
            // @ts-ignore
            const data: { [key: string]: any } = {}

            // @ts-ignore
            const { data: html } = await axios.get(this.URL);

            const $ = cheerio.load(html);
            data.title = $(".short-description > h1").text();
            data.image = $(".photo-figure > img").attr("src");
            data.price = $(".default-price > span > strong").text()
            data.price = data.price.replace("R$", "").trim()

            this.logger.info("Extracted title, image and price the site netshoes")
            this.logger.info("Adding product in card in netshoes")

            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    "--disable-notifications"
                ]
            }); 
            const page = await browser.newPage();
            await page.setUserAgent(this.getUserAgent())
            await page.goto(this.URL, { waitUntil: 'networkidle2' });
            await page.$eval(".product-size-selector .radio-options > li:nth-child(2) > a", (li: any) => li.click());
            await Promise.all([
                page.$eval("#buy-button-now", (li: any) => li.click()),
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ]);
            await page.$eval(".summary__item-text--coupon", (elementAddCupom: any) => elementAddCupom.click());
            this.logger.info("Appling coupon card in netshoes")

            await page.$eval("#coupon", (inputCoupon: any) => inputCoupon.value = "NETSUPER");
            await page.$eval('button[qa-auto="coupon-button"]', (buttonApplyCoupon: any) => buttonApplyCoupon.click());
            this.logger.info("Getting value after apply coupon in netshoes")

            const priceAfterApplyCoupon = await page.$eval('.summary__item-value > div', (valueWithDiscount: any) => valueWithDiscount.innerText)
            data.priceAfterApplyCoupon = priceAfterApplyCoupon;
            data.priceAfterApplyCoupon = data.priceAfterApplyCoupon.replace("R$", "").trim()

            await browser.close();
            this.logger.info("Storing data in cache")
            await this.cache.set(this.KEY_CACHE, JSON.stringify(data), this.TIME_EXPIRATION_CACHE_IN_SECONDS);
            return data;
        } catch (error) {
            this.logger.error(error);
        }
    }

}