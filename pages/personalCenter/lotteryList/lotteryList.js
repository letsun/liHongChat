// pages/lottery/lottery.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    joinList: '',
    hasNext: 'false',
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.joinList()
    common.uvpv('', '抽奖记录页') //页面访问uv信息
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    that.joinList()
  },


  joinList() {
    let that = this;
    let pageNum = that.data.pageNum;

    common.requestPosts(api.joinList+ app.globalData.memberId, {
      pageNum: pageNum,
    }, res => {
      let joinList = that.data.joinList;
      let hasNext = that.data.hasNext;
      if (joinList == '') {
        that.setData({
          joinList: res.data.data.joinList,
          hasNext: res.data.data.hasNext,
          joinLista:res.data.data
        })
      } else {
        if (hasNext == "true") {
          that.setData({
            joinList: joinList.concat(res.data.data.joinList),
            hasNext: res.data.data.hasNext
          })
        }
      }
    })
  },

  //跳转到提交订单页面
  shoppingOrder(e) {
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let joinLista = that.data.joinLista;
    let joinList = that.data.joinList;
    let joinid = e.currentTarget.dataset.joinid;
    app.globalData.goodsId = joinList[index].goodsId;
    app.globalData.companyId = joinList[index].companyId;
    var carinfo = {
      integral: 0, //合计积分
      num: 1, //商品数量
      goodsImgs: joinList[index].prizePic, //商品图片
      goodsName: joinList[index].prizeName, //商品名称
      goodsScore: joinList[index].prizeAmount, // 商品积分
      memScore: joinLista.memScore, //可使用积分
      orderCategory: 1 ,                        //积分传1
      joinid: joinid
    }
    carinfo = JSON.stringify(carinfo);

    wx.navigateTo({
      url: "../../shopping/shoppingOrder/shoppingOrder?carinfo=" + carinfo
    })
  },


})