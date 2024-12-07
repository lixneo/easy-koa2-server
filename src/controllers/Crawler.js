const { startProcess, qiniuUpload } = require("../libs/utils"),
  { addSliderData } = require("../services/Slider");
config = require("../config/config");

class Crawler {
  crawlSlierData() {
    startProcess({
      path: "../crawlers/slider",
      async message(data) {
        // console.log("message:", data);
        data.slice(0, 3).map(async (item) => {
          if (item.imgUrl && !item.imgKey) {
            const qiniu = config.qiniu;

            try {
              const imgData = await qiniuUpload({
                url: item.imgUrl,
                bucket: qiniu.bucket.bbimg.bucket_name,
                ak: qiniu.keys.ak,
                sk: qiniu.keys.sk,
                ext: ".jpg",
              });

              if (imgData.key) {
                item.imgKey = imgData.key;
              }

              const result = await addSliderData(item);

              if (result) {
                console.log("Data create OK");
              } else {
                console.log("Data create ERROR");
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      },
      async exit(code) {
        console.log("exit:", code);
      },
      async error(err) {
        console.log("error:", err);
      },
    });
  }
}

module.exports = new Crawler();