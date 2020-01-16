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

    onLoad (options) {
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
            success: function (res) {
                that.setData({
                    latitude : res.latitude  ,//经度
                    longitude : res.longitude//纬度
                });

                that.getLocation();
            },
            fail: function ()  {

            }
        });
    },

    // 获取地理位置
    getLocation () {
        var that = this;
        BMap.regeocoding({
            location: that.data.latitude + ',' + that.data.longitude,
            success: function (res) {
                app.globalData.addressComponent = res.originalData.result.addressComponent;
                console.log(res.originalData.result.addressComponent);
            },
            fail: function () {
                wx.showToast({
                    title: '请检查位置服务是否开启',
                })
            },
        });
    },

    // 打开规则弹窗
    openRule () {
        this.setData({
            isRuleShow: true,
        })
    },

    // 关闭规则弹窗
    confirmRule () {
        this.setData({
            isRuleShow: false,
        })
    },

    // 打开摇一摇弹窗
    openShake () {
        this.setData({
            isShakeShow: true,
        })
    },

    // 摇一摇
    shakeFunc () {
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
            wx.onAccelerometerChange(function (e) {
                let curTime = new Date().getTime();//获取当前时间戳
                let diffTime = curTime - lastTime;//获取摇动的间隔

                if (diffTime > 400) {
                    that.setData({
                        x: e.x,
                        y: e.y,
                        z: e.z,
                    });
                    lastTime = curTime;//记录上一次摇动的时间
                    if (e.x > 1 || e.y > 1 || e.z > 1) {
                        console.log(e.x,e.y,e.z);
                        innerAudioContextStart.play();
                        innerAudioContextStart.onEnded(function () {
                            innerAudioContextEnd.stop();
                            setTimeout(function () {
                                innerAudioContextEnd.play();
                            },50)
                        })

                    }
                }

            })
        }

    },


    // 抽奖
    lottery () {

    },

    onShow () {
        var that = this;
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
})