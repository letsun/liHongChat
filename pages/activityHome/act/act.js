const RdWXBizDataCrypt = require('../../../utils/WXBizDataCrypt.js');
const app = getApp();
const common = require("../../../utils/common.js");
const api = require("../../../utils/api.js");
var bmap = require('../../../utils/bmap-wx.min.js');
const utilMd5 = require("../../../utils/md5.js");
var BMap;
var innerAudioContextEnd;
var innerAudioContextStart;
Page({
  data: {
    // flag: true,
    latitude: '',
    longitude: '',
    isShakeShow: false,
    isResultShow: false,
    isRuleShow: false,
    isShake: true,
    isqr: false,
    ak: 'T8bHwH42XGSNXOkaByf3b9EnTFPiSS4X',
    code: '',
    //code: 'Gjups44WM6PXLW93pn33CED6A',

    // https://test-qr.cresz.com.cn/Gjups44WM6PXLW93pn33CED6A
    // https://test-qr.cresz.com.cn/Gjups04WM6S7GB38pn6783CBE
    // https://test-qr.cresz.com.cn/Gjups64WM6T6GX38pn2875974
  },

  // isflag() {
  //   this.setData({
  //     flag: false
  //   })
  // },

  load(e) {
    console.log(e, 33)
  },

  error(e) {
    console.log(e, 37)
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
    }

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

  onShow(options) {
    let that = this;
    console.log(app.globalData.qrtypes, '44')

    //个人中心扫码进来
    if (app.globalData.qrtypes == 1) {
      console.log('1111')
      that.setData({
        isqr: false,
        isShake: true
      })
    }
    if (app.globalData.code != '') {
      this.setData({
        code: app.globalData.code
      })
    }


    console.log(that.data.code)
    var data = wx.getLaunchOptionsSync() //获取场景代码
    console.log(data.scene, '场景值')

    common.getopenid(res => {
      app.globalData.idData.sessionKey = res.data.result.sessionKey
      app.globalData.idData.openid = res.data.result.openid
      common.uvpv('', '一物一码活动主页') //页面访问uv信息
    })
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
      fail: function(res) {
        common.showToast('请检查位置服务是否开启', 'none', res => {})
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

  // openShake() {
  //   this.setData({
  //     isShakeShow: true
  //   })
  // },
  openShake(res) {
    // this.lottery()
    let that = this;
    console.log(res)

    var data = wx.getLaunchOptionsSync() //获取场景代码
    console.log(data.scene, '场景值')
    //判断码是否为空
    if (that.data.code != '') {

      //判断场景值是否为1011
      if (data.scene == '1011') {
        if (res.detail.userInfo != null) {
          app.globalData.headImg = res.detail.userInfo.avatarUrl;
          app.globalData.nickName = res.detail.userInfo.nickName;
          app.globalData.sex = res.detail.userInfo.gender;
          var appId = 'wx92ddcbce04fc34b6';
          var encryptedData = res.detail.encryptedData;
          var iv = res.detail.iv;
          var pc = new RdWXBizDataCrypt(appId, app.globalData.idData.sessionKey);
          var data = pc.decryptData(encryptedData, iv);
          // debugger

          console.log(data)
          app.globalData.idData.unionId = data.unionId;

          this.setData({
            isShakeShow: true,
            isqr: true
          })



          that.shakeFunc()

        } else {
          wx.showToast({
            title: '亲,我拿不到你的头像与昵称呢',
            icon: 'none',
          });
        }
      }else {
        wx.showToast({
          title: '扫码异常，请删除小程序重新扫码！',
          icon: 'none',
        });
      }

    } else {
      common.showToast('请扫描二维码参与活动', 'none', res => {})
    }

  },

  // 摇一摇
  shakeFunc() {
    console.log('摇一摇')
    let that = this;

    let lastTime = 0;
    innerAudioContextStart = wx.createInnerAudioContext();
    innerAudioContextEnd = wx.createInnerAudioContext();
    innerAudioContextStart.src = 'https://wechat-1254182596.cos.ap-guangzhou.myqcloud.com/lihong/suc.mp3';
    innerAudioContextEnd.src = 'https://wechat-1254182596.cos.ap-guangzhou.myqcloud.com/lihong/suc2.mp3';

    wx.onAccelerometerChange(function(e) {
      if (that.data.isqr) {
        let curTime = new Date().getTime(); //获取当前时间戳
        let diffTime = curTime - lastTime; //获取摇动的间隔
        if (diffTime > 400) {
          lastTime = curTime; //记录上一次摇动的时间
          if (e.x > 1 || e.y > 1 || e.z > 1) {
            if (that.data.isShake) {
              that.setData({
                isShake: false
              })
              console.log(e.x, e.y, e.z, '138');
              innerAudioContextStart.play();
              innerAudioContextStart.onEnded(function() {
                innerAudioContextEnd.stop();
                setTimeout(function() {
                  that.lottery();
                  innerAudioContextEnd.play();
                }, 50)
              })
            }
          }
        }
      }
    })


  },


  // 抽奖
  lottery() {
    common.showLoading()
    let that = this;
    let address = app.globalData.formatted_address; //详细地址
    let city = app.globalData.addressComponent.city; //市区
    let district = app.globalData.addressComponent.district; //地区
    let headimgurl = app.globalData.headImg; //用户头像
    let labelno = that.data.code;
    let latitude = that.data.latitude; //纬度
    let longitude = that.data.longitude; //经度
    let nickname = app.globalData.nickName; //	用户昵称
    let openid = app.globalData.idData.openid; //小程序openid
    let province = app.globalData.addressComponent.province; //省份
    let street = app.globalData.addressComponent.street; //街道
    let town = app.globalData.addressComponent.town; //城镇
    let unionId = app.globalData.idData.unionId; //微信unionid
    common.requestPostf(api.lotter, {
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
      // type  0=红包 1=优惠券 2=实物 3=积分 4=权益券

      let lottery = res.data.data
      that.setData({
        lottery: lottery,
        isResultShow: true,
      })
      if (lottery.type == 0) {

        that.userCash() //红包提现
      } else {
        wx.hideLoading();
      }
      that.setData({
        code: ''
      })
    }, reg => {
      wx.hideLoading();
      setTimeout(res => {
        common.showToast(reg.data.msg, 'none', res => {
          that.setData({
            code: ''
          })
          that.setData({
            isResultShow: false,
            isShakeShow: false,
          })
        })
      }, 500)

    })
  },


  /**
   * 
   * 红包提现
   */
  userCash() {
    console.log('268')
    let that = this;
    let openid = app.globalData.idData.openid; //小程序openid
    let lottery = that.data.lottery;
    let code = that.data.code;
    common.requestPost(api.userCash, {
      openid: openid,
      amount: lottery.redPack.prizeAmount,
      cashType: 0, // 默认： 0
      lotteryId: lottery.lotteryId, //  中奖记录ID
      activityCode: code, //  活动二维码
    }, res => {
      that.setData({
        usercash: res.data.data,
        isResultShow: true,
      })

      wx.hideLoading();
      console.log(that.data.usercash, '284')
    })
  },


  //点击开红包

  hbbtn() {
    let that = this;
    let usercash = that.data.usercash;
    let openid = app.globalData.idData.openid; //小程序openid
    let lottery = that.data.lottery;
    console.log(usercash, '334')
    that.setData({
      isResultShow: false,
      isShakeShow: false,

    })


    // debugger
    wx.sendBizRedPacket({
      timeStamp: usercash.timeStamp, // 支付签名时间戳，
      nonceStr: usercash.nonceStr, // 支付签名随机串，不长于 32 位
      package: usercash.package, //扩展字段，由商户传入
      signType: usercash.signType, // 签名方式，
      paySign: usercash.paySign, // 支付签名
      success: function(reg) {
        console.log('微信提现成功回调', reg)
      },

      fail: function(reg) {
        console.log('微信提现失败回调', reg)
        console.log('微信提现失败回调', reg.errMsg)
        //提交错误信息
        common.requestPost(api.msg, {
          wxerrmsg: reg.errMsg,
          openid: openid,
          redpackmsg: " lotteryId:" + lottery.lotteryId
        }, reg => {

        })
      },
      complete: function(res) {}
    })
  },


  // 扫一扫
  scanFunc() {
    // debugger
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
        }
      }
    })
  },
  //跳转到个人中心
  personal() {
    wx.switchTab({
      url: '../../personalCenter/personal/personal',
    })

    that.setData({
      isResultShow: false,
      isShakeShow: false
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
  },

  onUnload: function () {

    console.log('412')
    innerAudioContextEnd.destroy();
    innerAudioContextStart.destroy();
  }
})