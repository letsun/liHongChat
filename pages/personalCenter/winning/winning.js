const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    lotteryList: '',
    hasNext: 'false',
    infomask: false,
    address: ["北京市", "北京市", "东城区"],
  },



  /**
   * 生命周期函数--监听页面显示
   */

  onShow() {
    let that = this;
    let memberId = app.globalData.memberId;
    that.lotteryList();
    if (app.globalData.memberId > 0) {
      that.userInfo();
    }

    common.uvpv('', '一物一码记录页') //页面访问uv信息
  },

  //获取用户信息
  userInfo() {
    let that = this;
    common.requestPost(api.userInfo + app.globalData.memberId, {}, res => {
      that.setData({
        userInfo: res.data.data
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    that.lotteryList()
  },


  lotteryList() {
    let that = this;
    let pageNum = that.data.pageNum;
    common.requestPosts(api.lotteryList + app.globalData.memberId, {
      pageNum: pageNum,
    }, res => {
      let lotteryList = that.data.lotteryList;
      let hasNext = that.data.hasNext;
      if (lotteryList == '') {
        that.setData({
          lotteryList: res.data.data.lotteryList,
          hasNext: res.data.data.hasNext
        })
      } else {
        if (hasNext == "true") {
          that.setData({
            lotteryList: lotteryList.concat(res.data.data.lotteryList),
            hasNext: res.data.data.hasNext
          })
        }
      }
    })
  },


  //填写信息弹窗
  infomask(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let lotteryList = that.data.lotteryList;

    let lotteryId = lotteryList[index].lotteryId;
    let prizeType = lotteryList[index].prizeType;

    let prizeAmount = lotteryList[index].prizeAmount;

    let activityEncode = lotteryList[index].activityEncode
    if (prizeType == 0) {
      that.setData({
        lotteryId: lotteryId,
        prizeAmount: prizeAmount,
        activityEncode: activityEncode,
        index:index,
      })

      that.userCash()

    } else {
      that.setData({
        index: index,
        lotteryId: lotteryId,
        infomask: true,

   
      })
    }


  },



  /**
   * 
   * 红包提现
   */
  userCash() {
    let that = this;
    let lotteryId = that.data.lotteryId;
    let activityEncode = that.data.activityEncode;
    let prizeAmount = that.data.prizeAmount;

    common.requestPostf(api.userCash, {
      openid: app.globalData.idData.openid,
      amount: prizeAmount,
      cashType: 0, // 默认： 0
      lotteryId: lotteryId, //  中奖记录ID
      activityCode: activityEncode, //  活动二维码
      transferType: 1,
    }, res => {

      wx.hideLoading({});
      let lotteryList = that.data.lotteryList;
      let index = that.data.index;
      lotteryList[index].status = 1;
      that.setData({
        lotteryList:lotteryList
      })

      setTimeout(res => {
        common.showToast('领取成功，红包已发放到零钱', 'none', res => { })
      }, 500)

    }, reg => {
      setTimeout(res => {
        common.showToast(reg.data.msg, 'none', res => { })
      }, 500)
    })



  },


  //选择地区

  pickchange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      address: e.detail.value
    })
  },

  //信息提交后关闭弹窗
  infobtn(e) {
    let that = this;

    let name = e.detail.value.name;
    let phone = e.detail.value.phone;
    let receiveAddress = e.detail.value.receiveAddress;
    let receiveProvince = that.data.address[0];
    let receiveCity = that.data.address[1];
    let receiveArea = that.data.address[2];

    if (name == '') {
      common.showToast('姓名不能为空', 'none', res => { });
      return false;
    } else if (phone == '') {
      common.showToast('手机号码不能为空', 'none', res => { });
      return false;
    } else if (receiveAddress == '') {
      common.showToast('详细地址不能为空', 'none', res => { });
      return false;
    }

    common.requestPosts(api.saveEntityObjRewardAddr, {
      lotteryRecordId: that.data.lotteryId,
      openid: app.globalData.idData.openid,
      receiveProvince: receiveProvince,
      receiveCity: receiveCity,
      receiveArea: receiveArea,
      receiveName: name,
      receivePhone: phone,
      receiveAddress: receiveAddress
    }, res => {
      let lotteryList = that.data.lotteryList;
      let index = that.data.index;
      lotteryList[index].status = 1;

      common.showToast('信息提交成功', 'none', res => {

      })
      that.setData({
        infomask: false,
        lotteryList: lotteryList
      })
    })


  },


  infomaskcolse() {
    let that = this;
    that.setData({
      infomask: false,
    })

  }
})