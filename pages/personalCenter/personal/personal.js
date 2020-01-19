// pages/index/index.js

const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [{
        'img': 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_58.png',
        'name': '我的订单'
      },
      {
        'img': 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_59.png',
        'name': '我的地址'
      },
      {
        'img': 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_60.png',
        'name': '积分记录'
      },
      {
        'img': 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_61.png',
        'name': '抽奖记录'
      },
      {
        'img': 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_62.png',
        'name': '签到记录'
      },
      {
        'img': 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_63.png',
        'name': '点赞记录'
      },
      {
        'img': 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_64.png',
        'name': '评论记录'
      },
      {
        'img': 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_65.png',
        'name': '分享记录'
      },
      {
        'img': 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_66.png',
        'name': '一物一码中奖记录'
      }
    ],
  },

  onShow() {
    let that = this;
    let memberId = app.globalData.memberId;
    if (app.globalData.memberId>0) {
      that.userInfo();

      that.setData({
        memberId: memberId,
      })
    }
  },

  //获取用户信息
  userInfo() {
    let that = this;
    common.requestPost(api.userInfo+ app.globalData.memberId,{},res=>{
      that.setData({
        userInfo:res.data.data
      })
    })
  },


  //点击调取授权信息
  login() {
    common.login()
  },


  //跳转填写个人资料
  personalData() {
    let that = this;

    if(that.data)

    wx.navigateTo({
      url: '../../personalCenter/personalData/personalData',
    })
  },


  //点击进入nav 导航
  bindnav(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;

    if (app.globalData.memberId > 0) {
      if (index == 0) {
        wx.navigateTo({
          url: '../../personalCenter/orders/orders',
        })
      } else if (index == 1) {
        wx.navigateTo({
          url: '../../personalCenter/myaddress/myaddress?types=' + 0,
        })
      } else if (index == 2) {
        wx.navigateTo({
          url: '../../personalCenter/integralList/integralList',
        })
      } else if (index == 3) {
        wx.navigateTo({
          url: '../../personalCenter/lotteryList/lotteryList',
        })
      } else if (index == 4) {
        wx.navigateTo({
          url: '../../personalCenter/signInList/signInList',
        })
      } else if (index == 5) {
        wx.navigateTo({
          url: '../../personalCenter/praiseList/praiseList',
        })
      } else if (index == 6) {
        wx.navigateTo({
          url: '../../personalCenter/commentList/commentList',
        })
      } else if (index == 7) {
        wx.navigateTo({
          url: '../../personalCenter/shareList/shareList',
        })
      } else if (index == 8) {
        wx.navigateTo({
          url: '../../personalCenter/winning/winning',
        })
      }
    }else {
      common.login()
    }
  }
})