// pages/orders/orders.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: ["待发货", "待收货", "已完成"],
    status: '3',
    indexa: 0,
    pageNum: 1,
    orderList: '',
    hasNext: 'false',
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    that.orderList();
    common.uvpv('', '我的订单页') //页面访问uv信息
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    that.orderList()
  },


  //查看物流信息
  kdinfo(e) {
    let that = this;
    let orderNo = e.currentTarget.dataset.orderno;
    let index = e.currentTarget.dataset.index;
    let orderList = that.data.orderList;
    let kdinfolist = that.data.kdinfolist;

    common.requestPost(api.kdinfo + orderNo, {
      memberId: app.globalData.memberId
    }, res => {

      if (orderList[index].kdinfo == false) {
        orderList[index].kdinfo = true;

      } else {
        orderList[index].kdinfo = false;
      }

      orderList[index].kdinfolist = res.data.data


      that.setData({
        orderList: orderList,
        // kdinfo: kdinfolist
      })

    })
  },

  /**
   * 
   * 3.待发货; 4.货待收; 5.已完成 
   */
  orderList() {
    let that = this;
    let pageNum = that.data.pageNum;
    let status = that.data.status;

    common.requestPosts(api.orderList + app.globalData.memberId, {
      pageNum: pageNum,
      status: status,
    }, res => {
      let orderList = res.data.data.orderList;

      for (var i in orderList) {
        orderList[i].kdinfo = false;
      }

      let hasNext = that.data.hasNext;
      if (that.data.orderList == '') {
        that.setData({
          orderList: res.data.data.orderList,
          hasNext: res.data.data.hasNext
        })
      } else {
        if (hasNext == "true") {
          that.setData({
            orderList: that.data.orderList.concat(res.data.data.orderList),
            hasNext: res.data.data.hasNext
          })
        }
      }

    })
  },

  //确认收货
  orderOk(e) {

    let that = this;
    let index = e.currentTarget.dataset.index;
    let orderno = e.currentTarget.dataset.orderno;
    let orderList = that.data.orderList;
    common.showModal('提示', '是否确认收货？', confirm => {
      common.requestPost(api.orderOk + orderno, {
        memberId: app.globalData.memberId
      }, res => {
        orderList.splice(index,1);
        that.setData({
          orderList: orderList
        })
      })
    }, cancel => {})

  },

  //点击切换导航
  tabBtn(e) {
    let that = this;
    var index = e.currentTarget.dataset.index;
    if (index == 0) {
      var status = 3
    } else if (index == 1) {
      var status = 4
    } else {
      var status = 5
    }
    that.setData({
      indexa: index,
      status: status,
      pageNum: 1,
      orderList: '',
    })

    that.orderList()
  },

})