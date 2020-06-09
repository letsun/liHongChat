const RdWXBizDataCrypt = require('../../utils/WXBizDataCrypt.js');
const common = require("../../utils/common.js");
const api = require("../../utils/api.js");
const app = getApp();
Page({

  data: {

  },

  onLoad: function() {
    const that = this;

    console.log(app)
  },

  goHome(type) {
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上个页面
    
    console.log(prevPage.route)
    console.log(currPage)

    if (type==1) {
      
        //登录后美味社区页面刷新
        prevPage.setData({
          mwktList:'',
          indexa:'0'
        })
        prevPage.categoryList();
        prevPage.siginInfo()
      
 
    }

    wx.navigateBack({
      delta: 1,
    });
  },



  bindgetuserinfo: function(res) {
    console.log(res)
    let that = this;
    that.setData({
      userInfo: res.detail.userInfo
    })

    if (res.detail.userInfo != null) {
      app.globalData.headImg = res.detail.userInfo.avatarUrl;
      app.globalData.nickName = res.detail.userInfo.nickName;
      app.globalData.sex = res.detail.userInfo.gender;
      var appId = 'wx92ddcbce04fc34b6';
      var encryptedData = res.detail.encryptedData;
      var iv = res.detail.iv;
      var pc = new RdWXBizDataCrypt(appId, app.globalData.idData.sessionKey);
      var data = pc.decryptData(encryptedData, iv);
      console.log(data)
      app.globalData.idData.unionId = data.unionId;

    } else {
      wx.showToast({
        title: '亲,我拿不到你的头像与昵称呢',
        icon: 'none',
      });

      // setTimeout(function () {
      //     that.goHome();
      // },1500)

    }
  },


  //获取手机号码
  getPhoneNumber(e) {
    let that = this;


    if (e.detail.errMsg != 'getPhoneNumber:fail user deny') {

      common.requestPost(api.decrypt, {
        sessionKey: app.globalData.idData.sessionKey,
        encryptData: e.detail.encryptedData,
        ivData: e.detail.iv,
        openid: app.globalData.idData.openid
      }, reg => {

        if (reg.data.code == 200) {
          let data = JSON.parse(reg.data.data)
          app.globalData.mobile = data.phoneNumber
          that.reginfo()
        }
      })
    }

  },


  //注册用户信息
  reginfo() {
    let that = this;
    common.requestPost(api.reginfo, {
      headImg: app.globalData.headImg,
      nickName: app.globalData.nickName,
      sex: app.globalData.sex,
      unionId: app.globalData.idData.unionId,
      xcxOpenid: app.globalData.idData.openid,
      mobile: app.globalData.mobile
    }, res => {

      if (res.data.code == 200) {
        app.globalData.memberId = res.data.data.memId;

        if (res.data.data.firstReg == 'N') {
            setTimeout(function () {
              let pages = getCurrentPages();
            
              let currPage = pages[pages.length - 1]; //上个页面
              console.log(currPage.route)
              // debugger
              if (currPage.route =="pages/delicious/deliciousList/deliciousList") { 
                console.log(1)

                that.goHome(1);
              }else{
                console.log(2)
                that.goHome();
              }
                
            },1500)
        } else {

          let score = res.data.data.score
          wx.reLaunch({
            url: '../login/login?score=' + score,
          })
        }

      }
    })
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})