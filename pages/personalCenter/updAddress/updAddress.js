// pages/write/write.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },


  onLoad(options) {
    let that = this;
    let addressInfo = JSON.parse(options.addressInfo);
    let pickValue = [addressInfo.recProvince, addressInfo.recCity, addressInfo.recArea];
    if (addressInfo.isDefault ==0) {
      var isDefault = false
    }else {
      var isDefault = true
    }
  
    that.setData({
      addressInfo: addressInfo,
      isDefault: isDefault,
      pickValue: pickValue
    })  
  },

  //修改地址
  addressUpd(e) {
    let that = this;
    // debugger
    let id = that.data.addressInfo.id,
      isDefault = that.data.isDefault,
      receiveAddress = e.detail.value.receiveAddress,
      receiveArea = that.data.pickValue[2],
      receiveCity = that.data.pickValue[1],
      receiveName = e.detail.value.receiveName,
      receiveProvince = that.data.pickValue[0],
      receivePhone = e.detail.value.receivePhone;
      if (isDefault == false) {
        isDefault = 0
      } else {
        isDefault = 1
      }

    common.requestPosts(api.addressUpd+ app.globalData.memberId, {
      id:id,
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
  },

  //选择省市区
  pickchange(e) {
    let that = this;
    that.setData({
      pickValue: e.detail.value
    })
  }  

})