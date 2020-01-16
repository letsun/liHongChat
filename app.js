const RdWXBizDataCrypt = require('utils/WXBizDataCrypt.js');
App({
  onLaunch: function () {
    
  },
  login (callback) {
    let that = this;

    wx.login({
        success: res => {
            wx.request({
                url: that.globalData.baseURL + 'mini/program/getOpenidByCode',
                data: {
                    code: res.code
                },
                header: {
                    'Accept': 'application/json',
                    'content-type': "application/x-www-form-urlencoded",
                },
                method: 'POST',
                success: function (reg) {
                    that.globalData.idData = reg.data.result;
                    wx.getUserInfo({
                        success: function (red) {
                            that.globalData.headImg = red.userInfo.avatarUrl;
                            that.globalData.nickName = red.userInfo.nickName;
                            that.globalData.sex = red.userInfo.gender;
                            var appId = 'wx92ddcbce04fc34b6';
                            var encryptedData = red.encryptedData;
                            var iv = red.iv;
                            var pc = new RdWXBizDataCrypt(appId, that.globalData.idData.sessionKey);
                            var data = pc.decryptData(encryptedData, iv);
                            that.globalData.idData.unionId = data.unionId;

                            wx.request({
                                url: that.globalData.baseURL2 + 'api/member/register/info',
                                data: {
                                    headImg: that.globalData.headImg,
                                    nickName: that.globalData.nickName,
                                    sex	: that.globalData.sex,
                                    unionId: that.globalData.idData.unionId,
                                    xcxOpenid: that.globalData.idData.openid,
                                },
                                header: {
                                    'content-type': "application/x-www-form-urlencoded",
                                },
                                method: 'POST',
                                success: function (reg) {
                                    if (reg.data.code == 200) {
                                        that.globalData.memberId = reg.data.data.memId;
                                    }
                                },
                                fail: function (reg) { },
                            })
                        },
                        fail: function (red) {
                            wx.navigateTo({
                                url: '../../author/author',
                            })
                        },
                    })
                },
                fail: function (reg) { },
                complete: function (reg) { },
            })

        }
    })
  },
  globalData: {
    memberId: '2',
    idData: {
      openid: 'ofjyq5X3IvRpUGmOtXY0CMCE5odI',
      apipwd:'',
      token:'',
      sessionKey:'',
      unionId: "",
    },
    addressComponent: {
      province: '',
      city: '',
      district: '',
      street: '',
      town: '',
    },
    baseURL: 'http://192.168.1.105:18001/',
    baseURL2: 'http://192.168.1.105:8085/',
    goodsId:'',//商品id
  }
})