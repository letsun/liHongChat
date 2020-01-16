// pages/submit/submit.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carinfo:{
      goodsImgs: "http://ywymprod.oss-cn-shenzhen.aliyuncs.com/tongyi/20191212/f51aa93696ba48e3b2b43ff7471d6a9d.jpg",
      goodsName: "220g藤椒油",
      goodsScore: 2000,
      integral: 4000,
      memScore: 2000,
      num: 2
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // let carinfo = JSON.parse(options.carinfo);
    // that.setData({
    //   carinfo: carinfo
    // })
  },  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    that.address()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  //收货地址
  address() {
    let that = this;
    common.requestPost(api.address,{},res=>{
      that.setData({
        addressInfo:res.data.data
      })
    })
  },


  //跳转到支付成功页面
  shoppingPayment() {
    let that= this;
    common.showModal('提示', '此次兑换将花费'+ that.data.carinfo.integral +'积分,是否确认兑换？', confirm=>{

      // common.

    },cancel=>{})

    // wx.navigateTo({
    //   url: "../../shopping/shoppingPayment/shoppingPayment"
    // })
  },

  //跳转到收货地址
  myaddress() {
    wx.navigateTo({
      url: '../../personalCenter/myaddress/myaddress?types='+1,
    })
  }

})