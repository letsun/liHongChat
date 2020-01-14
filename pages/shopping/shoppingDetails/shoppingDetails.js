// pages/details/details.js

const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    that.shoppingDetail()
  },


  //商品详情

  shoppingDetail() {
    let that = this;
    //app.globalData.goodsId
    common.requestPost(api.shoppingDetail + 1, {}, res => {
      var jsonProp = JSON.parse(res.data.data.jsonProp);
      var goodsDesc = res.data.data.goodsDesc

      goodsDesc = goodsDesc
        .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
        .replace(/<p>/ig, '<p style="font-size: 15Px; line-height: 25Px;">')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 style="max-width: 315px; border-radius: 8px;"')

      that.setData({
        goodsInfo: res.data.data,
        jsonProp: jsonProp,
        goodsDesc: goodsDesc,
        integral: res.data.data.goodsScore
      })
    })
  },

  shoppingOrder() {


    var carinfo = []


    // wx.navigateTo({
    //   url: "../../shopping/shoppingOrder/shoppingOrder"
    // })
  },



  //减少数量
  minus() {
    let that = this;
    let num = that.data.num;
    let goodsScore = that.data.goodsInfo.goodsScore;

    let integral = that.data.integral-0;

    num--;

    integral = goodsScore * num;

    if (num >= 0) {
      that.setData({
        num: num,
        integral: integral
      })
    }
  },

  //添加数量

  add() {
    let that = this;
    let goodsScore = that.data.goodsInfo.goodsScore;
    let num = that.data.num;
    let integral = that.data.integral-0;

    num++;
    integral = goodsScore * num;
    
    if (num > 0) {
      that.setData({
        num: num,
        integral: integral
      })
    }
  }

})