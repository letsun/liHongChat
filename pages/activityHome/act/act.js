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

    imapath :app.globalData.imapath,
    infomask: false,
    latitude: '',
    longitude: '',

    isShake: true,
    isqr: false,
    ak: 'T8bHwH42XGSNXOkaByf3b9EnTFPiSS4X',
    //code: '',
    address: ["北京市", "北京市", "东城区"],

    code: '',


    // https://test-qr.cresz.com.cn/Gjups44WM6PXLW93pn33CED6A
    // https://test-qr.cresz.com.cn/Gjups04WM6S7GB38pn6783CBE
    // https://test-qr.cresz.com.cn/Gjups64WM6T6GX38pn2875974


    mask:false,//奖项弹窗
    mask1:false,//积分红包弹窗
    mask2:false,//实物奖弹窗
    mask3:false,//实物奖填写信息弹窗
    shakewin:false, //打开摇一摇页面

    rules:false,//打开活动规则
  },


  //打开摇一摇弹窗
  openShake() {
    let that = this;
    var data = wx.getLaunchOptionsSync() //获取场景代码
    console.log(data.scene, '场景值')
    // debugger
    //判断码是否为空
    if (that.data.code != '') {
      // this.lottery()
      // that.shakeFunc();
      that.setData({
        shakewin:true,
        // isqr: true
      })
    } else {
      common.showToast('请扫描二维码参与活动', 'none', res => { })
    }

  },

  clicklotter() {
    let that = this;

     
    that.setData({
      // shakewin:true,
      isqr: true
    })

    that.shakeFunc();
  },


  //打开活动规则
  openrules() {
    let that = this;

    common.requestGet(api.rule, {
      ruleType: 1
    }, res => {
      var detail = res.data.data.content.replace(/\<section/gi, '<div');
      var detail2 = detail.replace(/section\>/gi, 'div>');
      var detail3 = detail2.replace(/\<u/gi, '<i');
      var detail4 = detail3.replace(/u\>/gi, 'i>');
      that.setData({
        content: detail4.replace(/\<img/gi, '<img style="display:block;max-width:100%;margin:0 auto;height:auto" '),
        rules:true,
      })
    })
  },


  //关闭活动规则
  closerules(){
    let that = this;
    that.setData({
      rules:false,
    })
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
    } else {
      common.login(res=> {})
    }

    BMap = new bmap.BMapWX({
      ak: that.data.ak
    });

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude, //纬度
          longitude: res.longitude //经度
        });

        that.getLocation();
      },
      fail: function () {

      }
    });
  },



  onShow(options) {
    let that = this;

    //个人中心扫码进来
    if (app.globalData.qrtypes == 1) {

      that.setData({
        isqr: false,
        isShake: true,
        code: app.globalData.code
      })
    }


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
      success: function (res) {
        app.globalData.addressComponent = res.originalData.result.addressComponent;
        app.globalData.formatted_address = res.originalData.result.formatted_address;
        console.log(res.originalData.result.addressComponent);
      },
      fail: function (res) {
        common.showToast('请检查位置服务是否开启', 'none', res => { })
      },
    });
  },




  // 摇一摇
  shakeFunc() {

    let that = this;

    let lastTime = 0;
    innerAudioContextStart = wx.createInnerAudioContext();
    innerAudioContextEnd = wx.createInnerAudioContext();
    innerAudioContextStart.src = 'https://wechat-1254182596.cos.ap-guangzhou.myqcloud.com/lihong/suc.mp3';
    innerAudioContextEnd.src = 'https://wechat-1254182596.cos.ap-guangzhou.myqcloud.com/lihong/suc2.mp3';

    wx.onAccelerometerChange(function (e) {
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
              innerAudioContextStart.onEnded(function () {
                innerAudioContextEnd.stop();
                setTimeout(function () {
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
    common.showLoading();
 
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
        mask: true,
      })

      if (lottery.type == 0) {
        that.userCash() //红包提现
        that.setData({
          mask1:true
        })
        wx.hideLoading();
      } else if (lottery.type == 2) {
        that.setData({
          mask2:true,
          lotteryId: lottery.lotteryId
        })
        wx.hideLoading();
      }else if(lottery.type ==3) {
        that.setData({
          mask1:true
        })
        wx.hideLoading();
      } else {
        wx.hideLoading();
      }

    }, reg => {
      wx.hideLoading();
      setTimeout(res => {
        common.showToast(reg.data.msg, 'none', res => {
          app.globalData.code =''
          that.setData({
            mask: false,
            infomask: false,
            shakewin:false,
            mask1:false,//积分红包弹窗
            mask2:false,//实物奖弹窗
            mask3:false,//实物奖填写信息弹窗
            code:''
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
    let that = this;
    let lottery = that.data.lottery;
    let labelno = that.data.code;

    var data = wx.getLaunchOptionsSync() //获取场景代码
    console.log(data.scene, '场景值')

    common.showLoading();

    // if (data.scene == '1011') {
    //   var transferType = 0;
    // } else {
    //   var transferType = 1;
    // }
    common.requestPostf(api.userCash, {
      openid: app.globalData.idData.openid,
      amount: lottery.redPack.prizeAmount,
      cashType: 0, // 默认： 0
      lotteryId: lottery.lotteryId, //  中奖记录ID
      activityCode: labelno, //  活动二维码
      transferType: 1,
    }, res => {
      app.globalData.code =''
      that.setData({
        usercash: res.data.data,
        code: '',
      })

      
      // if (transferType == 0) {
      //   wx.hideLoading({});
      //   that.hbbtn()   
      // } else {
        wx.hideLoading({});
        // setTimeout(res => {
        //   common.showToast('领取成功，红包已发放到零钱', 'none', res => { })
        // }, 500)

      // }
    }, reg => {
      setTimeout(res => {
        common.showToast(reg.data.msg, 'none', res => { })
      }, 500)
    })

  },




  //开红包
  hbbtn() {
    let that = this;
    let usercash = that.data.usercash;
    let openid = app.globalData.idData.openid; //小程序openid
    let lottery = that.data.lottery;

    // debugger
    wx.sendBizRedPacket({
      timeStamp: usercash.timeStamp, // 支付签名时间戳，
      nonceStr: usercash.nonceStr, // 支付签名随机串，不长于 32 位
      package: usercash.package, //扩展字段，由商户传入
      signType: usercash.signType, // 签名方式，
      paySign: usercash.paySign, // 支付签名
      success: function (reg) {
  
      },

      fail: function (reg) {
        //提交错误信息
        common.requestPost(api.msg, {
          wxerrmsg: reg.errMsg,
          openid: openid,
          redpackmsg: " lotteryId:" + lottery.lotteryId
        }, reg => {

        })
      },
      complete: function (res) { }
    })
  },


  //关闭中奖弹窗
  colsemask() {

    let that = this;
    app.globalData.code =''
    that.setData({
      shakewin:false,
      mask:false,//奖项弹窗
      mask1:false,//积分红包弹窗
      mask2:false,//实物奖弹窗
      mask3:false,//实物奖填写信息弹窗
      code: ''
    })

  },

  //填写信息弹窗
  infomask() {
    let that = this;
    that.setData({
      mask2:false,
      mask3: true,
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




      app.globalData.code =''
      that.setData({
        mask: false,
        infomask: false,
        shakewin:false,
        mask1:false,//积分红包弹窗
        mask2:false,//实物奖弹窗
        mask3:false,//实物奖填写信息弹窗
        code:''
      })

      setTimeout(res=>{
        common.showToast('信息提交成功', 'none', res => {})
      },100)
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
        url: '../../personalCenter/winningList/winningList',
      })
    } else {
      common.login()
    }
  },







  onUnload: function () {

    if (innerAudioContextEnd != undefined || innerAudioContextStart != undefined) {
      innerAudioContextEnd.destroy();
      innerAudioContextStart.destroy();
    }

  }
})