// pages/delicious/signIn/signIn.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

const util = require("../../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask:false,

  },

  onShow() {
    let that = this;

    var timer = util.formatTimea(new Date())
    var year = util.year(new Date())
    var month = util.month(new Date())

    
    that.setData({
      timer: timer,
      year: year,
      month: month
    })

    that.siginInfo();
    that.calendar();
  },

  //签到信息
  siginInfo() {
    let that = this;
    common.requestPost(api.siginInfo, {
    }, res => {
      that.setData({
        siginInfo: res.data.data
      })
    })
  },

  //日历签到记录
  calendar(){
    let that = this;

    common.requestPost(api.calendar, {
      yearMonth: that.data.timer,
    }, res => {
      that.setData({
        calendar: res.data.data
      })
    })
  },


  //点击查看之前月份
  back() {
    let that = this;
    var month = that.data.month - 0 - 1;
    var year = that.data.year - 0;

    if (that.data.month <= 1) {
      var year = year - 1;
      var month = 12
    }

    if (month <= 9) {
      month = "0" + month
    }

    var timer = year + '-' + month

    that.setData({
      month: month,
      year: year,
      timer: timer
    })

    that.calendar()
  },



  //点击查看后面月份
  forward(){
    let that  = this;  
    var month = that.data.month - 0 + 1;
    var year = that.data.year-0;
     
    if (that.data.month >= 12) {
      var year = year + 1;
      var month = 1
    }

    if (month<=9) {
      month ="0"+month
    }

    var timer =  year + '-' +month

    that.setData({
      month: month,
      year: year,
      timer:timer
    })

    that.calendar()
  },

  //点击签到
  siginBtn(){

    let that = this;
    common.requestPost(api.siginBtn, {
    }, res => {
      that.setData({
        siginBtn: res.data.data,
        mask:true
      })

      that.siginInfo();
      that.calendar();
    })
  },

  //关闭签到弹窗
  close() {
    let that = this;
    that.setData({
      mask: false,
    })
  },

})