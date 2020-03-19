// pages/submit/submit.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // carinfo: {
    //   goodsImgs: "http://ywymprod.oss-cn-shenzhen.aliyuncs.com/tongyi/20191212/f51aa93696ba48e3b2b43ff7471d6a9d.jpg",
    //   goodsName: "220g藤椒油",
    //   goodsScore: 2,
    //   integral: 4,
    //   memScore: 2000,
    //   num: 2,
    // },

    orderRemark: '',
    isTipsShow: false,    // 是否弹出提示框
    tipsText: '',    // 提示框提示文字
    addressInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let carinfo = JSON.parse(options.carinfo);
    that.setData({
      carinfo: carinfo
    })

    common.uvpv('', '提交订单页') //页面访问uv信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    that.address()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


  //收货地址
  address() {
    let that = this;
    common.requestPost(api.address + app.globalData.memberId, {}, res => {
      that.setData({
        addressInfo: res.data.data
      })
    })
  },


  //跳转到支付成功页面
  shoppingPayment() {
    // debugger
    let that = this;
    if (that.data.addressInfo == '') {
      common.showToast('请填写收货地址', 'none', res => { })
    }else{
      this.setData({
        tipsText: '此次兑换将花费' + this.data.carinfo.integral + '积分,是否确认兑换？',
        isTipsShow: true,
      })
    }
  },


  inputchange(e) {
    let that = this;
    console.log(e)
    that.setData({
      orderRemark: e.detail.value
    })
  },

  //跳转到收货地址
  myaddress() {
    wx.navigateTo({
      url: '../../personalCenter/myaddress/myaddress?types=' + 1,
    })
  },

  // 关掉提示框
  cancelTip () {
      this.setData({
        isTipsShow: false,
      })
  },

  // 确认提示框
  confirmTip() {
    let that = this;
    that.setData({
      isTipsShow: false,
    })
    let obj = {};
    let goodsList = {};

    goodsList.amount = that.data.carinfo.num;
    goodsList.goodsId = app.globalData.goodsId;

    obj.goodsList = goodsList;
    obj.mallType = 1;
    obj.orderCategory = that.data.carinfo.orderCategory;
    obj.orderRemark = that.data.orderRemark;
    obj.orderType = 0;
    obj.payScore = that.data.carinfo.integral;
    obj.payType = 5;
    obj.receiveAddrId = that.data.addressInfo.id;
    obj.companyId = app.globalData.companyId;
    if (that.data.carinfo.joinid!=undefined) {
      obj.containerId = that.data.carinfo.joinid;
    }
 
    let orderInfo = JSON.stringify(obj)

    common.requestPost(api.submitOrder + app.globalData.memberId, {
      orderInfo: orderInfo
    }, res => {
      wx.navigateTo({
        url: "../../shopping/shoppingPayment/shoppingPayment"
      })
    })
  },

})