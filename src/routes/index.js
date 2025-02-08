const router = require('koa-router')();
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { getCurrentDate } = require('../libs/utils');
// 定义数据目录的路径
const dataDir = path.join(__dirname, '../data');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

// 现存数据日期
router.get('/ranking/date', async (ctx, next) => {
  try {
    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);
    // 过滤出所有的 JSON 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const dates = jsonFiles.map(file => file.split('.')[0]);

    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: dates
    };

  } catch (err) {
    console.log(err);

    ctx.body = {
      code: 1,
      msg: 'error',
    };
  }
})

// 保存排行榜数据
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
    console.log(err);

    ctx.body = {
      code: 1,
      msg: '保存失败',
    };
  }
})

// 1、获取各分区上榜次数
router.get('/ranking/counts', async (ctx, next) => {
  try {
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

    const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: sortedCounts
    };

  } catch (err) {
    console.log(err);

    ctx.body = {
      code: 1,
      msg: 'error',
    };
  }
})

// 2、获取各分区总播放量
router.get('/ranking/views', async (ctx, next) => {
  try {
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
    const sortedViews = Object.entries(views).sort((a, b) => b[1] - a[1]);

    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: sortedViews
    };

  } catch (err) {
    console.log(err);

    ctx.body = {
      code: 1,
      msg: 'error',
    };
  }
});

// 3、各分区总弹幕量 接口
router.get('/ranking/danmakus', async (ctx, next) => {
  try {

    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);
    // 过滤出所有的 JSON 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // 初始化一个对象用于存储各分区的计数
    const danmakus = {};

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
        const danmakuCount = item.stat.danmaku;
        danmakus[tname] = (danmakus[tname] || 0) + danmakuCount; // 统计总弹幕数
      });
    }

    const sortedDanmakus = Object.entries(danmakus).sort((a, b) => b[1] - a[1]);

    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: sortedDanmakus
    };

  } catch (err) {
    console.log(err);

    ctx.body = {
      code: 1,
      msg: 'error',
    };
  }
})


// 4、各分区互动情况 接口
router.get('/ranking/interact', async (ctx, next) => {
  try {
    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);
    // 过滤出所有的 JSON 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // 初始化一个对象用于存储各分区的计数
    const interact = {};

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

        // Initialize the interact[tname] object if it doesn't exist
        if (!interact[tname]) {
          interact[tname] = {
            likes: 0,
            coins: 0,
            favorites: 0,
            danmakus: 0,
            shares: 0,
          };
        }

        const likeCount = item.stat.like; // 点赞数 
        const coinCount = item.stat.coin; // 投币数
        const favoriteCount = item.stat.favorite; // 收藏数
        const danmakuCount = item.stat.danmaku; // 弹幕数
        const shareCount = item.stat.share; // 转发数

        interact[tname].likes += likeCount; // 统计总点赞数
        interact[tname].coins += coinCount; // 统计总投币数
        interact[tname].favorites += favoriteCount; // 统计总收藏数
        interact[tname].danmakus += danmakuCount; // 统计总弹幕数
        interact[tname].shares += shareCount; // 统计总转发数
      });
    }

    const sortedDanmakus = Object.entries(interact).sort((a, b) =>
      Object.values(b[1]).reduce((acc, cur) => acc + cur, 0) -
      Object.values(a[1]).reduce((acc, cur) => acc + cur, 0));
    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: sortedDanmakus
    };
  } catch (err) {
    console.log(err);

    ctx.body = {
      code: 1,
      msg: 'error',
    };
  }
})

// 5、各分区三连情况 接口
router.get('/ranking/three-likes', async (ctx, next) => {
  try {
    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);
    // 过滤出所有的 JSON 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // 初始化一个对象用于存储各分区的计数
    const threeLikes = {};

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

        // Initialize the threeLikes[tname] object if it doesn't exist
        if (!threeLikes[tname]) {
          threeLikes[tname] = {
            likes: 0,
            coins: 0,
            favorites: 0,
            views: 0,
          };
        }

        const likeCount = item.stat.like; // 点赞数 
        const coinCount = item.stat.coin; // 投币数
        const favoriteCount = item.stat.favorite; // 收藏数
        const viewCount = item.stat.view; // 收藏数

        threeLikes[tname].likes += likeCount; // 统计总点赞数
        threeLikes[tname].coins += coinCount; // 统计总投币数
        threeLikes[tname].favorites += favoriteCount; // 统计总收藏数
        threeLikes[tname].views += viewCount; // 统计总播放量
      });
    }

    const sortedThreeLikes = Object.entries(threeLikes).sort((a, b) =>
      Object.values(b[1]).reduce((acc, cur) => acc + cur, 0) -
      Object.values(a[1]).reduce((acc, cur) => acc + cur, 0));

    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: sortedThreeLikes
    };
  } catch (err) {
    console.log(err);

    ctx.body = {
      code: 1,
      msg: 'error',
    };
  }
})

// 6、分区每天天播放量情况 接口
router.get('/ranking/days-views', async (ctx, next) => {
  try {
    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);
    // 过滤出所有的 JSON 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // 初始化一个对象用于存储各分区的计数
    const fiveDaysViews = {};

    // 读取并处理每个 JSON 文件
    for (const file of jsonFiles) {
      // 构建日期对象
      let date = file.split('.')[0];
      fiveDaysViews[date] = {};
      // 构建每个文件的完整路径
      const filePath = path.join(dataDir, file);
      // 读取文件内容
      const fileContent = await fs.readFile(filePath, 'utf-8');
      // 解析 JSON 数据
      const jsonData = JSON.parse(fileContent);

      // 统计每个 tname 的出现次数
      jsonData.data.forEach(item => {
        const tname = item.tname;
        const viewCount = item.stat.view; // 播放量
        fiveDaysViews[date][tname] = (fiveDaysViews[date][tname] || 0) + viewCount; // 统计总播放量
      });
    }

    const sortedFiveDaysViews = Object.entries(fiveDaysViews);

    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: sortedFiveDaysViews
    };
  } catch (err) {
    console.log(err);

    ctx.body = {
      code: 1,
      msg: 'error',
    };
  }

})

// 7、up主上榜次数 接口
router.get('/ranking/up-counts', async (ctx, next) => {
  try {

    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);
    // 过滤出所有的 JSON 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // 初始化一个对象用于存储各分区的计数
    const upCounts = {}, timesCounts = {};

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
        const mid = item.owner.mid;
        const name = item.owner.name;
        upCounts[mid] = {
          name,
          counts: (upCounts[mid]?.counts || 0) + 1
        };
      });
    }

    Object.values(upCounts).forEach(item => {
      timesCounts[item.counts] = (timesCounts[item.counts] || 0) + 1;
    });

    // 将结果返回给客户端
    ctx.body = {
      code: 0,
      data: timesCounts
    };

  } catch (err) {
    console.log(err);

    ctx.body = {
      code: 1,
      msg: 'error',
    };
  }

})

// 8、标题词云图接口
router.get('/ranking/wordcloud', async (ctx, next) => {
  try {
    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);
    // 过滤出所有的 JSON 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // 存储所有标题文本
    let allTitles = '';

    // 读取并处理每个 JSON 文件
    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      // 拼接所有标题
      jsonData.data.forEach(item => {
        allTitles += item.title + '\n';
      });
    }

    const words = allTitles.match(/[\u4e00-\u9fa5a-zA-Z0-9]+/g);
    const wordMap = {};

    words.forEach(word => {
      if (word.length > 1) { // 过滤单字词
        wordMap[word] = (wordMap[word] || 0) + 1; // 统计词频
      }
    });

    ctx.body = {
      code: 0,
      data: wordMap
    };

  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 1,
      msg: '生成词云失败'
    };
  }
});

// 9、top5 接口
router.get('/ranking/top5up', async (ctx, next) => {
  try {
    // 读取数据目录中的所有文件
    const files = await fs.readdir(dataDir);

    // 初始化一个对象用于存储各分区的计数
    const upCounts = {};

    // 读取并处理每个 JSON 文件
    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      // 统计每个 tname 的出现次数
      jsonData.data.forEach(item => {
        const mid = item.owner.mid;
        const name = item.owner.name;
        // const follower = item.staff.follower;
        upCounts[mid] = {
          name,
          // follower,
          counts: (upCounts[mid]?.counts || 0) + 1
        };
      });
    }

    const sortedTop5 = Object.values(upCounts).sort((a, b) => b.counts - a.counts).slice(0, 5);

    // 将结果返回给客户端 

    ctx.body = {
      code: 0,
      data: sortedTop5
    };
  } catch (err) {
    console.log(err);

    ctx.body = {
      code: 1,
      msg: 'error',
    };
  }
})

// 新增接口：获取所有接口数据
router.get('/fetch/all', async (ctx, next) => {
  try {
    // 依次请求各个接口的数据
    const [datesResponse, rankingCountsResponse, rankingViewsResponse, rankingDanmakusResponse, rankingInteractResponse, rankingThreeLikesResponse, rankingDaysViewsResponse, rankingUpCountsResponse, rankingWordCloudResponse, rankingTop5UpResponse] = await Promise.all([
      axios.get(`${ctx.origin}/ranking/date`),
      axios.get(`${ctx.origin}/ranking/counts`),
      axios.get(`${ctx.origin}/ranking/views`),
      axios.get(`${ctx.origin}/ranking/danmakus`),
      axios.get(`${ctx.origin}/ranking/interact`),
      axios.get(`${ctx.origin}/ranking/three-likes`),
      axios.get(`${ctx.origin}/ranking/days-views`),
      axios.get(`${ctx.origin}/ranking/up-counts`),
      axios.get(`${ctx.origin}/ranking/wordcloud`),
      axios.get(`${ctx.origin}/ranking/top5up`)
    ]);

    // 将所有接口的数据整合
    ctx.body = {
      code: 0,
      data: {
        dates: datesResponse.data,
        rankingCounts: rankingCountsResponse.data,
        rankingViews: rankingViewsResponse.data,
        rankingDanmakus: rankingDanmakusResponse.data,
        rankingInteract: rankingInteractResponse.data,
        rankingThreeLikes: rankingThreeLikesResponse.data,
        rankingDaysViews: rankingDaysViewsResponse.data,
        rankingUpCounts: rankingUpCountsResponse.data,
        rankingWordCloud: rankingWordCloudResponse.data,
        rankingTop5Up: rankingTop5UpResponse.data,
      }
    };
  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 1,
      msg: '获取所有数据失败',
    };
  }
});

module.exports = router
