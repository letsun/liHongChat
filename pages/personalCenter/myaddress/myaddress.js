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

  tapFunc(e) {
    this.setData({
      is: true,
    })
  },

  onLoad(options) {
    let that = this;
    that.setData({
      types: options.types
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;

    that.addressList()
    common.uvpv('', '收货地址页') //页面访问uv信息
  },

  //收货地址列表
  addressList() {
    let that = this;


    common.requestPost(api.addressList + app.globalData.memberId, {}, res => {
      that.setData({
        list: res.data.data
      })
    })
  },

  //删除收货地址
  addressDel(e) {
    let that = this;
    let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
    let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西
    let receiveId = e.currentTarget.dataset.id;

    console.log()
    common.showModal('提示', '你确定删除地址吗？', confirm => {
      common.requestPost(api.addressDel + app.globalData.memberId, {
        receiveId: receiveId
      }, res => {

        if (that.data.types == 1) {
          if (receiveId == prevPage.__data__.addressInfo.id) {
            prevPage.setData({
              addressInfo: ''
            })
          }
        }

        that.addressList()
      })
    }, cancel => {})
  },


  //设置为默认收货地址
  isDefault(e) {
    let that = this;
    let receiveId = e.currentTarget.dataset.id
    common.requestPost(api.addressDef + receiveId, {}, res => {
      that.addressList()
    })
  },

  //跳转到添加收货人
  addAddress() {
    wx.navigateTo({
      url: '../../personalCenter/addAddress/addAddress',
    })
  },


  //修改收货人
  updAddress(e) {

    let that = this;
    let index = e.currentTarget.dataset.index;
    let list = that.data.list;
    let addressInfo = JSON.stringify(list[index])

    wx.navigateTo({
      url: '../../personalCenter/updAddress/updAddress?addressInfo=' + addressInfo,
    })
  },

  //订单获取收货地址信息
  addinfo(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let list = that.data.list;
    let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
    let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西

    if (that.data.types == 1) {
      /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，
  后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */

      prevPage.setData({
        addressInfo: list[index]
      })


      wx.navigateBack({
        delta: 1
      })
    }
  }


})