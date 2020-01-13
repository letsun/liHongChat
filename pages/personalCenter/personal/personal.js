// pages/index/index.js
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //跳转填写个人资料

  personalData() {
    wx.navigateTo({
      url: '../../personalCenter/personalData/personalData',
    })

  },
  
  bindnav(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;

    if (index==0) {
      wx.navigateTo({
        url: '../../personalCenter/orders/orders',
      })
    } else if (index == 1) {
      wx.navigateTo({
        url: '../../personalCenter/myaddress/myaddress',
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

  }
})