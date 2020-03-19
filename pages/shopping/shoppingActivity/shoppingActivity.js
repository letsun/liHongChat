const app = getApp();
const common = require("../../../utils/common.js");
const api = require("../../../utils/api.js");
var newData = new Date().getTime();
const utilMd5 = require("../../../utils/md5.js");
var key = "api-HR-lihong2019!@#$%^&";

let timer;
let cjIn = false;
let cjChange = 0; //抽奖过程KEY

Page({


  /**
   * 页面的初始数据
   */
  data: {
    bgSrc: 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_84.png',
    cjChange: -1, //抽奖过程KEY
    prizeResult: null, //抽奖结果KEY
    prizeName: null, //抽奖结果KEY对应的奖品名称

    showAgain: false, //是否抽奖后显示再抽一次按钮
    prizeData: {},
    prizeIndex: -1,
    mum: 0,
    isResultShow: false,
  },


  //抽奖操作
  cj() {
    // debugger
    let This = this;
    if (this.data.mum > 0) {
      this.setData({
        cjChange: -1,
      });
      // debugger
      if (cjIn) {
        wx.showToast({
          title: '正在抽奖请稍候...',
          icon: 'none',
          duration: 2000,
          mask: true,
        });
        return;
      } else {
        console.log('111')
        cjIn = true;
        cjChange = 0;
        this.lottery(function() {
          for (var i = 0; i < This.data.prizeData.prizeList.length; i++) {
            if (This.data.prizeData.prizeList[i].prizeId == This.data.resultData.prizeId) {
              This.setData({
                prizeIndex: i,
              })
            }
          }

          clearInterval(timer);
          timer = setInterval(This.changePrize, 80);
        })
      }
    } else {
      wx.showToast({
        title: '您已经没有抽奖机会啦！',
        icon: 'none',
        duration: 2000,
        mask: true,
      });
      return;
    }

  },
  //抽奖过程奖品切换
  changePrize() {

    let This = this;
    This.setData({
      cjChange: cjChange
    });

    if (cjChange > 8) {
      clearInterval(timer);
      timer = setInterval(This.changePrize, 160);
    }

    if (cjChange > 16) {
      clearInterval(timer);
      timer = setInterval(This.changePrize, 240);
    }

    if (cjChange > 24) {
      clearInterval(timer);
      timer = setInterval(This.changePrize, 360);
    }

    if (cjChange > 30) {
      clearInterval(timer);
      timer = setInterval(This.changePrize, 430);
    }

    if (cjChange > 32 && cjChange % 8 == This.data.prizeIndex) {
      clearInterval(timer);
      setTimeout(function() {
        This.setData({
          isResultShow: true
        });
        cjIn = false;

        // setTimeout(function() {
        //   // This.getPrize();
        //   return;
        // }, 200)
      }, 1000)
    }

    cjChange++;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPrize();
  },
  // 获取奖项
  getPrize() {
    common.requestPosts(api.activity, {
      memberId: app.globalData.memberId,
    }, res => {
      if (res.data.code == 200) {
        if (res.data.data.activityBgPic != '') {
          this.setData({
            bgSrc: res.data.data.activityBgPic
          })
        }
        let mum = res.data.data.joinLimit - res.data.data.memJoin;
        this.setData({
          prizeData: res.data.data,
          mum: mum
        })
      }
    })
  },

  // 抽奖
  lottery(callback) {
    let that = this;
    wx.request({
      url: api.lottery + app.globalData.memberId,
      data: {
        activityId: this.data.prizeData.activityId,
      },
      header: {
        'content-type': "application/x-www-form-urlencoded",
        'oi': app.globalData.idData.openid,
        'times': newData,
        's': utilMd5.hexMD5(app.globalData.idData.openid + app.globalData.idData.apipwd + newData + key).toUpperCase(),
        'pwd': app.globalData.idData.apipwd,
        'tk': app.globalData.idData.token,
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            resultData: res.data.data
          });

          callback();
        } else {
          cjIn = false;
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: true,
          });
        }
      },
      fail: function(reg) {},
    })
  },

  //跳转到提交订单页面
  shoppingOrder() {
    let that = this;
  
    app.globalData.goodsId = that.data.resultData.goodsId;
    app.globalData.companyId = that.data.resultData.companyId;
    var carinfo = {
      integral: 0, //合计积分
      num: 1, //商品数量
      goodsImgs: that.data.resultData.prizeImg, //商品图片
      goodsName: that.data.resultData.prizeName, //商品名称
      goodsScore: that.data.resultData.prizeAmount, // 商品积分
      memScore: that.data.resultData.memScore, //可使用积分
      orderCategory:1 ,                        //积分传1
      joinid: that.data.resultData.joinId,
    }
    carinfo = JSON.stringify(carinfo);

    wx.navigateTo({
      url: "../../shopping/shoppingOrder/shoppingOrder?carinfo=" + carinfo
    })
  },



  // 跳转到个人中心
  toPersonCenter() {
    wx.switchTab({
      url: '../../personalCenter/personal/personal',
    })
  },

  // 跳转到个人中心
  lotteryList() {
    wx.navigateTo({
      url: '../../personalCenter/lotteryList/lotteryList',
    })
  },

  // 关闭中奖弹窗
  closeResult() {
    this.setData({
      isResultShow: false,
    })
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
    cjIn = false;
    cjChange = 0;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

});