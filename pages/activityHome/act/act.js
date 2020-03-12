const app = getApp();
const common = require("../../../utils/common.js");
const api = require("../../../utils/api.js");
var bmap = require('../../../utils/bmap-wx.min.js');
const utilMd5 = require("../../../utils/md5.js");
var BMap;
Page({
  data: {
    flag: true,
    latitude: '',
    longitude: '',
    isShakeShow: false,
    isResultShow: false,
    isRuleShow: false,
    isShake: true,
    isAni: false,
    ak: 'T8bHwH42XGSNXOkaByf3b9EnTFPiSS4X',
    //code:'',
    code: 'Gjups04WM6S7GB38pn6783CBE',

    // https://test-qr.cresz.com.cn/Gjups44WM6PXLW93pn33CED6A
    // https://test-qr.cresz.com.cn/Gjups04WM6S7GB38pn6783CBE
    // https://test-qr.cresz.com.cn/Gjups64WM6T6GX38pn2875974
  },

  isflag() {
    this.setData({
      flag: false
    })
  },

  load(e) {
    console.log(e, 33)
  },

  error(e) {
    console.log(e, 37)
  },


  onLoad(options) {
    wx.getLaunchOptionsSync()

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
    var data = wx.getLaunchOptionsSync()//获取场景代码
    console.log(data.scene,'场景值')

    common.getopenid(res => {
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
      fail: function() {
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
  openShake() {
    let that = this;

    if (that.data.code != '') {
      if (app.globalData.memberId > 0) {
        this.lottery()
        // this.setData({
        //   isShakeShow: true,
        // })
      } else {
        common.login();
      }
    } else {
      common.showToast('请扫描二维码参与活动', 'none', res => {})
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

    wx.onAccelerometerChange(function(e) {
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

    var newData = new Date().getTime();
    var key = "api-HR-lihong2019!@#$%^&";
    wx.request({
      url: api.lotter,
      method: "POST",
      header: {
        //'Content-Type': 'application/json'
        'Accept': 'application/json',
        "content-type": "application/x-www-form-urlencoded",
        'oi': app.globalData.idData.openid,
        'times': newData,
        's': utilMd5.hexMD5(app.globalData.idData.openid + app.globalData.idData.apipwd + newData + key).toUpperCase(),
        'pwd': app.globalData.idData.apipwd,
        'tk': app.globalData.idData.token,
        // 'ui': app.globalData.unionId,
      },

      data: {
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
      },
      success: res => {
        wx.hideLoading();
        if (res.data.code == 200) {


          // type  0=红包 1=优惠券 2=实物 3=积分 4=权益券
          console.log('219')
          let lottery = res.data.data
          that.setData({
            isResultShow: true,
            lottery: lottery,
          })

          if (lottery.type == 0) {
            that.userCash() //红包提现
          }

          that.setData({
            code: ''
          })
        } else {
          console.log('226')
          common.showToast(res.data.msg, 'none', res => {
            that.setData({
              code: ''
            })
          })
        }
      },

      fail: res => {
        common.showToast('网络异常，请重新刷新页面', 'none', res => {})
      },

      complete: res => {

      }

    })
    // common.requestPost(api.lotter, {
    //   address: address,
    //   city: city,
    //   district: district,
    //   headimgurl: headimgurl,
    //   labelno: labelno,
    //   latitude: latitude,
    //   longitude: longitude,
    //   nickname: nickname,
    //   openid: openid,
    //   province: province,
    //   street: street,
    //   town: town,
    //   unionId: unionId,
    // }, res => {
    //   // type  0=红包 1=优惠券 2=实物 3=积分 4=权益券

    //   console.log(res)
    //   let lottery = res.data.data
    //   that.setData({
    //     isResultShow: true,
    //     lottery: lottery
    //   })

    // })
  },


  /**
   * 
   * 红包提现
   */
  userCash() {
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
      console.log(res,'红包提现接口返回的内容')
      console.log(res.data.data.timeStamp,'timeStamp')
      console.log(res.data.data.nonceStr, 'nonceStr')
      console.log(res.data.data.package, 'package')
      console.log(res.data.data.signType, 'signType')
      console.log(res.data.data.paySign, 'paySign')

      // debugger
      wx.sendBizRedPacket({
        timeStamp: res.data.data.timeStamp, // 支付签名时间戳，
        nonceStr: res.data.data.nonceStr, // 支付签名随机串，不长于 32 位
        package: res.data.data.package, //扩展字段，由商户传入
        signType: res.data.data.signType, // 签名方式，
        paySign: res.data.data.paySign, // 支付签名
        success: function(res) {

          console.log('微信提现成功回调',res)
        },
        fail: function(res) {
          console.log(res.errMsg)
          console.log('微信提现失败回调',res)
        },
        complete: function(res) {}
      })

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

          console.log(code);
        }
      }
    })
  },
  //跳转到个人中心
  personal() {

    if (app.globalData.memberId > 0) {
      wx.switchTab({
        url: '../../personalCenter/personal/personal',
      })

    } else {
      common.login()
    }
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
  onHide() {
    let that = this;
    // if (app.globalData.memberId > 0) {
    //   that.setData({
    //     code: '',
    //     isShakeShow: false,
    //   })
    // }

  }
})