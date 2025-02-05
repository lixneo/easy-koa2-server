// 返回当前时间
export const getCurrentTime = () => {
  //现在时间
  const now = new Date();
  const formattedDate = now.getFullYear() + '-' +
    (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
    now.getDate().toString().padStart(2, '0') + ' ' +
    now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0') + ':' +
    now.getSeconds().toString().padStart(2, '0');
  return formattedDate;
};

// 判断一个时间是否超过12小时
export const isOver12Hours = (oldData, newDate) => {
  const givenTime = new Date(oldData); // 给定时间
  const currentTime = new Date(newDate); // 给定时间

  // 计算当前时间与给定时间之间的差值（以毫秒为单位）
  const timeDifference = currentTime - givenTime;

  // 12小时的毫秒数
  const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;

  // 判断差值是否超过12小时
  return timeDifference > twelveHoursInMilliseconds;
}

export const deepClone = (obj) => {
  // 如果不是对象或数组，直接返回原值（基本类型值）
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 创建一个新对象或数组，取决于原对象的类型
  let clone = Array.isArray(obj) ? [] : {};

  // 递归拷贝对象或数组的每一项
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) { // 确保拷贝对象的可枚举属性
      clone[key] = deepClone(obj[key]);
    }
  }

  return clone;
}
