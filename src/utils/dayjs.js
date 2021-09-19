/**
 * 初始化 Dayjs 相关配置
 */
import Vue from 'vue'

import dayjs from 'dayjs'

// 配置使用中文语言包
import 'dayjs/locale/zh-cn'

var relativeTime = require('dayjs/plugin/relativeTime')

// 配置使用处理相对时间
dayjs.extend(relativeTime)


// 全局使用
dayjs.locale('zh-cn')

// 把处理相对时间的代码包装为全局
Vue.filter('relativeTiem', value => {
  return dayjs().to(dayjs(value))
})

Vue.filter('dateTime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})

// 例如时间日期格式化
// console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'));

// console.log(dayjs().to(dayjs('2021-01-01', true)));