// pages/address/address.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is: false,
  },

  tapFunc(e){
    this.setData({
      is: true,
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;

    that.addressList()
  },

  //收货地址列表
  addressList() {
    let that = this;
    common.requestPost(api.addressList, {}, res => {
      that.setData({
        list:res.data.data
      })
    })
  },

  

  //跳转到添加收货人
  addAddress() {
    wx.navigateTo({
      url: '../../personalCenter/addAddress/addAddress',
    })
  },



})