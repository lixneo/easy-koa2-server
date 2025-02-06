const router = require('koa-router')();
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { getCurrentDate } = require('../libs/utils');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/save/ranking', async (ctx, next) => {
  try {
    const filePath = path.join(__dirname, `../data/${getCurrentDate()}.json`);
    const url = 'https://api.bilibili.com/x/web-interface/ranking/v2'; // 官方排行榜接口
    try {
      const response = await axios.get(url);
      fs.writeFile(filePath, JSON.stringify({
        data: response.data.data.list
      }, null, 2), (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('File content has been replaced!');
        }
      });
    } catch (err) {
      console.log("请求官方接口失败");
    }

    ctx.body = {
      code: 0,
      msg: "保存成功"
    };

  } catch (err) {
    ctx.body = {
      code: 1,
      msg: '保存失败',
    };
  }
})

// 获取各分区上榜次数
router.get('/ranking/counts', async (ctx, next) => {
  try {
    // 定义数据目录的路径
    const dataDir = path.join(__dirname, '../data');
    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);
    // 过滤出所有的 JSON 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // 初始化一个对象用于存储各分区的计数
    const counts = {};

    // 读取并处理每个 JSON 文件
    for (const file of jsonFiles) {
      // 构建每个文件的完整路径
      const filePath = path.join(dataDir, file);
      // 读取文件内容
      const fileContent = await fs.readFile(filePath, 'utf-8');
      // 解析 JSON 数据
      const jsonData = JSON.parse(fileContent);

      // 统计每个 tname 的出现次数
      jsonData.data.forEach(item => {
        const tname = item.tname;
        counts[tname] = (counts[tname] || 0) + 1; // 如果 tname 已存在，则加 1，否则初始化为 1
      });
    }

    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: counts
    };

  } catch (err) {
    ctx.body = {
      code: 1,
      msg: '保存失败',
    };
  }
})

// 获取各分区总播放量
router.get('/ranking/views', async (ctx, next) => {
  try {
    // 定义数据目录的路径
    const dataDir = path.join(__dirname, '../data');
    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);
    // 过滤出所有的 JSON 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // 初始化一个对象用于统计总播放量
    const views = {};

    // 读取并处理每个 JSON 文件
    for (const file of jsonFiles) {
      // 构建每个文件的完整路径
      const filePath = path.join(dataDir, file);
      // 读取文件内容
      const fileContent = await fs.readFile(filePath, 'utf-8');
      // 解析 JSON 数据
      const jsonData = JSON.parse(fileContent);

      // 统计每个 tname 的出现次数
      jsonData.data.forEach(item => {
        const tname = item.tname;
        const viewCount = item.stat.view;
        views[tname] = (views[tname] || 0) + viewCount; // 统计总播放量
      });
    }

    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: views
    };

  } catch (err) {
    ctx.body = {
      code: 1,
      msg: '保存失败',
    };
  }
});

module.exports = router
