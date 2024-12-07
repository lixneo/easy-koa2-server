const router = require('koa-router')(),
crawlerController = require("../controllers/Crawler");

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get("/crawler", crawlerController.crawlSlierData);

module.exports = router
