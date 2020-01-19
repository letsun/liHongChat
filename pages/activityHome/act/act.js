const app = getApp();
const common = require("../../../utils/common.js");
const api = require("../../../utils/api.js");
var bmap = require('../../../utils/bmap-wx.min.js');
var BMap;
Page({
  data: {
    isShakeShow: false,
    isResultShow: false,
    isRuleShow: false,
    isShake: true,
    isAni: false,
    ak: 'T8bHwH42XGSNXOkaByf3b9EnTFPiSS4X',
  },

  onLoad(options) {
    let that = this;
    let q = decodeURIComponent(options.q);
    if (q != 'undefined') {
      let urlList = q.split('/');
      let code = urlList[urlList.length - 1];
      that.setData({
        code: code,
      });

      console.log(code);
    }
    // app.login(function () {
    //
    // })

    BMap = new bmap.BMapWX({
      ak: that.data.ak
    });

    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude: res.latitude, //纬度
          longitude: res.longitude //经度
        });

        that.getLocation();
      },
      fail: function() {

      }
    });
  },

  onShow() {
    console.log(app)
  },

  // 获取地理位置
  getLocation() {
    var that = this;
    BMap.regeocoding({
      location: that.data.latitude + ',' + that.data.longitude,
      success: function(res) {
        app.globalData.addressComponent = res.originalData.result.addressComponent;
        app.globalData.formatted_address = res.originalData.result.formatted_address;
        console.log(res.originalData.result.addressComponent);
      },
      fail: function() {
        wx.showToast({
          title: '请检查位置服务是否开启',
        })
      },
    });
  },

  // 打开规则弹窗
  openRule() {
    this.setData({
      isRuleShow: true,
    })
  },

  // 关闭规则弹窗
  confirmRule() {
    this.setData({
      isRuleShow: false,
    })
  },

  // 打开摇一摇弹窗
  openShake() {
    // this.setData({
    //     isShakeShow: true,
    // })

    if (app.globalData.memberId > 0) {
      // this.lottery()
      this.setData({
        isShakeShow: true,
      })
    } else {
      common.login();
    }
  },

  // 摇一摇
  shakeFunc() {
    let that = this;
    that.setData({
      isAni: true,
    });
    let lastTime = 0;
    const innerAudioContextStart = wx.createInnerAudioContext();
    const innerAudioContextEnd = wx.createInnerAudioContext();
    innerAudioContextStart.src = 'https://wechat-1254182596.cos.ap-guangzhou.myqcloud.com/lihong/suc.mp3';
    innerAudioContextEnd.src = 'https://wechat-1254182596.cos.ap-guangzhou.myqcloud.com/lihong/suc2.mp3';
    if (that.data.isShake) {
      that.setData({
        isShake: false,
      });
      wx.onAccelerometerChange(function(e) {
        let curTime = new Date().getTime(); //获取当前时间戳
        let diffTime = curTime - lastTime; //获取摇动的间隔

        if (diffTime > 400) {
          that.setData({
            x: e.x,
            y: e.y,
            z: e.z,
          });
          lastTime = curTime; //记录上一次摇动的时间
          if (e.x > 1 || e.y > 1 || e.z > 1) {
            console.log(e.x, e.y, e.z);
            innerAudioContextStart.play();
            innerAudioContextStart.onEnded(function() {
              innerAudioContextEnd.stop();
              that.lottery();
              setTimeout(function() {
                innerAudioContextEnd.play();
              }, 50)
            })

          }
        }

      })
    }

  },


  // 抽奖
  lottery() {
    let that = this;
    let address = app.globalData.formatted_address; //详细地址
    let city = app.globalData.addressComponent.city; //市区
    let district = app.globalData.addressComponent.district; //地区
    let headimgurl = app.globalData.headImg; //用户头像
    //let labelno ='covjF33CF6HBC0C0pn44F3BF7'; //二维码-
    let labelno = that.data.code;
    let latitude = that.data.latitude; //纬度
    let longitude = that.data.longitude; //经度
    let nickname = app.globalData.nickName; //	用户昵称
    let openid = app.globalData.idData.openid; //小程序openid
    let province = app.globalData.addressComponent.province; //省份
    let street = app.globalData.addressComponent.street; //街道
    let town = app.globalData.addressComponent.town; //城镇
    let unionId = app.globalData.idData.unionId; //微信unionid

    common.requestPost(api.lotter, {
      address: address,
      city: city,
      district: district,
      headimgurl: headimgurl,
      labelno: labelno,
      latitude: latitude,
      longitude: longitude,
      nickname: nickname,
      openid: openid,
      province: province,
      street: street,
      town: town,
      unionId: unionId,
    }, res => {
      // type  1  2  3中积分   

      let lottery = res.data.data
      that.setData({
        isResultShow: true,
        lottery: lottery
      })

      if (lottery.type == 0) {

      }
    })
  },


  // 扫一扫
  scanFunc() {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.result != 'undefined') {
          var urlList = res.result.split('/');
          var code = urlList[urlList.length - 1];
          that.setData({
            code: code,
          });

          console.log(code);
        }
      }
    })
  },
  //跳转到个人中心
  personal() {
    wx.switchTab({
      url: '../../personalCenter/personal/personal',
    })
  },

  //跳转到中奖记录
  winning() {
    if (app.globalData.memberId > 0) {
      wx.navigateTo({
        url: '../../personalCenter/winning/winning',
      })
    } else {
      common.login()
    }

  }

})