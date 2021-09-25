import { Express } from "express";
import { App } from "../constants/App";
import { cache } from "../utils/Cache";

export default (app: Express) => {


    app.get("/extracted-products", async (request, response) => {
        let extractedProduct = await cache.get(App.KEY_CACHE)
        if (!extractedProduct) {
            return response.json({
                "message": "Data the product not available yet. Try 2 minutos later, please."
            })
        }
        // @ts-ignore
        extractedProduct = JSON.parse(extractedProduct);
        response.json(extractedProduct)
    })
}