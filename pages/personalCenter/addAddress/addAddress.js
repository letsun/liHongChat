// pages/write/write.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDefault: false,
  },


  //保存地址
  addressAdd(e) {
    let that = this;


    let isDefault = that.data.isDefault,
      receiveAddress = e.detail.value.receiveAddress,
      receiveArea = e.detail.value.receiveArea,
      receiveCity = e.detail.value.receiveCity,
      receiveName = e.detail.value.receiveName,
      receiveProvince = e.detail.value.receiveProvince,
      receivePhone = e.detail.value.receivePhone;

    if (isDefault == false) {
      isDefault = 0
    } else {
      isDefault = 1
    }

    common.requestPosts(api.addressAdd, {
      isDefault: isDefault,
      receiveAddress: receiveAddress,
      receiveArea: receiveArea,
      receiveCity: receiveCity,
      receiveName: receiveName,
      receiveProvince: receiveProvince,
      receivePhone: receivePhone,
    }, res => {
      common.showToast('保存成功','success',res=>{})
      setTimeout(res=>{
        wx.navigateBack({
          delta: 1
        })
      },1500)
    })
  },



  //是否为默认地址
  isDefault() {

    let that = this;
    let isDefault = that.data.isDefault

    if (isDefault == false) {
      isDefault = true
    } else {
      isDefault = false
    }
    that.setData({
      isDefault: isDefault,
    })
  }




})