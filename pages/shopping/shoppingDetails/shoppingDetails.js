// pages/details/details.js

const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    integral: '',
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
    let that = this;
    that.shoppingDetail()
    let memberId = app.globalData.memberId;
    that.setData({
      memberId: memberId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


  //商品详情

  shoppingDetail() {
    let that = this;
    common.requestPost(api.shoppingDetail + app.globalData.goodsId, {
      memberId: app.globalData.memberId
    }, res => {

      app.globalData.companyId = res.data.data.companyId;
      var jsonProp = JSON.parse(res.data.data.jsonProp);
      var goodsDesc = res.data.data.goodsDesc

      goodsDesc = goodsDesc
        .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
        .replace(/<p>/ig, '<p style="font-size: 14px; line-height: 20px; color:#666;">')
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


  //跳转到提交订单页面
  shoppingOrder() {
    let that = this;

    if (app.globalData.memberId >0) {
      var carinfo = {
        integral: that.data.integral, //合计积分
        num: that.data.num, //商品数量
        goodsImgs: that.data.goodsInfo.goodsImgs[0].picUrl, //商品图片
        goodsName: that.data.goodsInfo.goodsName, //商品名称 
        goodsScore: that.data.goodsInfo.goodsScore, // 商品积分
        memScore: that.data.goodsInfo.memScore, //可使用积分
        orderCategory: 0                         //商品传0
      }
      carinfo = JSON.stringify(carinfo);
      if (that.data.num <= 0) {
        common.showToast('兑换数量不能小于1', 'none', res => { })
      } else {

        if (that.data.goodsInfo.memScore <that.data.integral) {
          common.showToast('可使用积分小于合计积分', 'none', res => { })
        }else {
          wx.navigateTo({
            url: "../../shopping/shoppingOrder/shoppingOrder?carinfo=" + carinfo
          })
        }

      }
    }else {
      common.login()
    }

  },



  //减少数量
  minus() {
    let that = this;
    let num = that.data.num;
    let goodsScore = that.data.goodsInfo.goodsScore;

    let integral = that.data.integral - 0;
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
    let integral = that.data.integral - 0;
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