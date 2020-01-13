// pages/shopping/shoppingActivity/shoppingActivity.js

let timer;
let cjIn = false;
let cjChange = 1; //抽奖过程KEY

Page({


  /**
   * 页面的初始数据
   */
  data: {
    prizeList: [
      { id: '001', index: 1, imgsrc: 'https://www.baidu.com/img/bd_logo1.png', prizeName: '奖品名称111' },
      { id: '002', index: 2, imgsrc: 'https://www.baidu.com/img/bd_logo1.png', prizeName: '奖品名称222' },
      { id: '003', index: 3, imgsrc: 'https://www.baidu.com/img/bd_logo1.png', prizeName: '奖品名称333' },
      { id: '004', index: 4, imgsrc: 'https://www.baidu.com/img/bd_logo1.png', prizeName: '奖品名称444' },
      { id: '005', index: 5, imgsrc: 'https://www.baidu.com/img/bd_logo1.png', prizeName: '奖品名称555' },
      { id: '006', index: 6, imgsrc: 'https://www.baidu.com/img/bd_logo1.png', prizeName: '奖品名称666' },
      { id: '007', index: 7, imgsrc: 'https://www.baidu.com/img/bd_logo1.png', prizeName: '奖品名称777' },
      { id: '008', index: 8, imgsrc: 'https://www.baidu.com/img/bd_logo1.png', prizeName: '奖品名称88888888888888' },
    ],

    cjChange: 1, //抽奖过程KEY
    prizeResult: null, //抽奖结果KEY
    prizeName: null, //抽奖结果KEY对应的奖品名称

    showAgain: false, //是否抽奖后显示再抽一次按钮

  },






  //抽奖操作
  cj() {
    if (cjIn) {
      return;
    } else {
      cjIn = true;
    }

    let This = this;

    clearInterval(timer);
    timer = setInterval(This.changePrize, 80);



    // test start
    let res = {
      stutus: 8,
      prizeResult: 4,
      prizeName: '奖品名称44444',

    }
    if (res.stutus == 8) {
      setTimeout(function () {
        clearInterval(timer);
        timer = setInterval(This.changePrize, 160);
        setTimeout(function () {
          clearInterval(timer);
          timer = setInterval(This.changePrize, 300);

          setTimeout(function () {
            This.setData({
              prizeResult: res.prizeResult,
              prizeName: res.prizeName,
            });
          }, 1000)
        }, 1000)
      }, 2000)
    }
    // test end



  },
  //抽奖过程奖品切换
  changePrize() {
    cjChange++;
    cjChange = cjChange > 8 ? 1 : cjChange;

    console.log(cjChange)

    let This = this;
    This.setData({
      cjChange: cjChange
    });

    if (This.data.prizeResult == cjChange) {
      clearInterval(timer);
      This.setData({
        showAgain: true
      });
      console.log('获得奖品：' + This.data.prizeName)
    }
  },
  //点击再抽一次按钮
  againBtn() {
    cjIn = false;
    cjChange = 1; //抽奖过程KEY

    let This = this;
    This.setData({
      cjChange: 1, //抽奖过程KEY
      prizeResult: null, //抽奖结果KEY
      prizeName: null, //抽奖结果KEY对应的奖品名称
      showAgain: false, //是否抽奖后显示再抽一次按钮
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})