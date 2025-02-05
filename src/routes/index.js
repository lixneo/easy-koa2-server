const router = require('koa-router')();
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');  // 导入 axios
const { getCurrentTime, isOver12Hours, deepClone } = require('../libs/utils');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/bilibili-interface/ranking', async (ctx, next) => {
  const filePath = path.join(__dirname, '../data/ranking.json');

  try {
    // 读取文件内容
    const data = await fs.readFile(filePath, 'utf-8');

    // 解析文件内容为 JSON 对象
    const jsonData = JSON.parse(data);

    let formattedDate = getCurrentTime();
    if (isOver12Hours(jsonData.time, formattedDate)) {
      console.log('超过12小时');

      const url = 'https://api.bilibili.com/x/web-interface/ranking/v2'; // 排行榜接口
      try {
        // 使用 axios 发起 GET 请求
        const response = await axios.get(url);

        let jsonData = deepClone({
          time: getCurrentTime(),
          list: response.data.data.list
        });

        // 清空文件并写入新内容
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error('Error writing to file:', err);
          } else {
            console.log('File content has been replaced!');
          }
        });

        // 将请求的响应内容返回给客户端
        ctx.body = {
          success: true,
          data: jsonData
        };
      } catch (err) {
        // 如果请求失败，返回错误信息
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: 'Failed to fetch data',
          error: err.message
        };
      }
    } else {
      console.log('没有超过12小时');
      // 将文件内容作为响应返回
      ctx.body = {
        success: true,
        data: jsonData
      };
    }

  } catch (err) {
    // 错误处理
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to read the file',
      error: err.message
    };
  }
})

module.exports = router
