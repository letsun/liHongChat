// pages/complete/complete.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickValue:'请输入',
    sex:['女','男'],
    index:0,
  },

  infoSub(e) {
    let that = this, 
      birthDay =e.detail.value.birthDay,
      buyAddr = e.detail.value.buyAddr,
      buyWho = e.detail.value.buyWho,
      city = that.data.city,
      district = that.data.district,
      memJob = e.detail.value.memJob,
      memName = e.detail.value.memName,
      memShop = e.detail.value.memShop,
      province =that.data.province,
      sex = that.data.index

    common.requestPosts(api.infoSub+ app.globalData.memberId, {
      birthDay: birthDay,
      buyAddr: buyAddr,
      buyWho: buyWho,
      city: city,
      district: district,
      memJob: memJob,
      memName: memName,
      memShop: memShop,
      province: province,
      sex: sex,
    }, res => {
      common.showToast('提交资料成功','success',res=>{})
        setTimeout(res=>{
          wx.navigateBack({})
        },1500)
    })
  },


   // 获取省市区
  pickchange(e) {

    let that = this;
    let pickValue = e.detail.value;
    let province = pickValue[0];
    let city = pickValue[1];
    let district = pickValue[2];
    that.setData({
      pickValue: pickValue,
      province: province,
      city: city,
      district: district,
    })
  },

  //获取男女

  sexchange(e) {
    let that = this;
    that.setData({
      index:e.detail.value
    })
  }
})