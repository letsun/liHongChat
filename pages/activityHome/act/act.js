
Page({
    data: {
        speed: '',
    },

    onLoad () {
        let that = this;
    },

    onShow () {
        var that = this;
        let lastTime = 0;
        const innerAudioContextStart = wx.createInnerAudioContext();
        const innerAudioContextEnd = wx.createInnerAudioContext();
        innerAudioContextStart.src = 'https://wechat-1254182596.cos.ap-guangzhou.myqcloud.com/lihong/suc.mp3';
        innerAudioContextEnd.src = 'https://wechat-1254182596.cos.ap-guangzhou.myqcloud.com/lihong/suc2.mp3';
        wx.onAccelerometerChange(function (e) {
            let curTime = new Date().getTime();//获取当前时间戳
            let diffTime = curTime - lastTime;//获取摇动的间隔

            if (diffTime > 400) {
                that.setData({
                    x: e.x,
                    y: e.y,
                    z: e.z,
                })
                lastTime = curTime;//记录上一次摇动的时间
                if (e.x > 1 || e.y > 1 || e.z > 1) {
                    /*wx.showToast({
                        title: '摇一摇成功',
                        icon: 'success',
                        duration: 2000
                    })*/

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
    },
})