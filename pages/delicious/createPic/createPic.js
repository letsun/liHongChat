const app = getApp();
const common = require("../../../utils/common.js");
const api = require("../../../utils/api.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarPath: '',
        imageTempPath: '',
        id: '',
        msgData: '',
        qrcode: 'https://wechat-1254182596.cos.ap-guangzhou.myqcloud.com/lihong/20200115/code.jpg',
        storeId: ''
    },
    //保存至相册
    saveImageToPhotosAlbum() {
        if (!this.data.imageTempPath) {
            wx.showModal({
                title: '提示',
                content: '图片绘制中，请稍后重试',
                showCancel: false
            })
        }
        wx.saveImageToPhotosAlbum({
            filePath: this.data.imageTempPath,
            success: (res) => {
                wx.showToast({
                    title: '保存成功',
                });
                console.log(res)
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },

    // 文字换行
    fillTextWrap(ctx, text, x, y, maxWidth, lineHeight) {
        // 设定默认最大宽度
        const systemInfo = wx.getSystemInfoSync();
        const deciveWidth = systemInfo.screenWidth;
        // 默认参数
        maxWidth = maxWidth || deciveWidth;
        lineHeight = lineHeight || 20;
        // 校验参数
        if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
            return;
        }
        // 字符串分割为数组
        const arrText = text.split('');
        // 当前字符串及宽度
        let currentText = '';
        let currentWidth;
        for (let letter of arrText) {
            currentText += letter;
            currentWidth = ctx.measureText(currentText).width;
            if (currentWidth > maxWidth) {
                ctx.fillText(currentText, x, y);
                currentText = '';
                y += lineHeight;
            }
        }
        if (currentText) {
            ctx.fillText(currentText, x, y);
        }
    },

    canvas() {
        const self = this;
        const ctx = wx.createCanvasContext('firstCanvas');
        ctx.rect(0, 0, 300, 430);
        ctx.setFillStyle('#ffffff');
        ctx.fill();
        if (self.data.objtype == 1) {
            self.setData({
                avatarPath: self.data.deliciousDetail.recipesPic
            })
        } else {
            self.setData({
                avatarPath: self.data.deliciousDetail.videoPic
            })
        }

        wx.getImageInfo({
            src: self.data.avatarPath,
            success(res) {
                self.setData({
                    avatarPath: res.path
                })

                ctx.drawImage(self.data.avatarPath, 0, 0, 300, 300);
                ctx.drawImage(self.data.qrcode, 190,310, 100, 100);

                let str = '';
                if (self.data.objtype == 1) {
                    str = self.data.deliciousDetail.recipesName.substring(0,30);
                    if (str.length * 2 <= 40) {
                        str = self.data.deliciousDetail.recipesName.substring(0, 30)
                    }else{
                        str = self.data.deliciousDetail.recipesName.substring(0, 22)+'...'
                    }
                } else {
                    str = self.data.deliciousDetail.videoName.substring(0,30);
                    if (str.length * 2 <= 40) {
                        str = self.data.deliciousDetail.videoName.substring(0, 30)
                    }else{
                        str = self.data.deliciousDetail.videoName.substring(0, 22)+'...'
                    }
                }

                ctx.setFontSize(15);
                ctx.setFillStyle('#333333');
                ctx.setTextAlign('left');
                self.fillTextWrap(ctx, str, 10, 350, 160, 20);

                ctx.draw(false, function () {
                    wx.canvasToTempFilePath({
                        canvasId: 'firstCanvas',
                        fileType: 'jpg',
                        success: function (res) {
                            // 获得图片临时路径
                            console.log(res, '8520');
                            self.setData({
                                imageTempPath: res.tempFilePath
                            });

                            wx.hideLoading();
                        }
                    })
                });
            },
            fail(res) {

            }
        });


       /* let price = '原价 ¥ ' + self.data.msgData.market_price.toFixed(2);
        ctx.setFontSize(12);
        ctx.setFillStyle('rgba(153,153,153,1)');
        ctx.setTextAlign('left');
        ctx.fillText(price, 10, 390);

        ctx.setFontSize(12);
        ctx.setFillStyle('#E7A131');
        ctx.setTextAlign('left');
        ctx.fillText('现价', 10, 410);

        let prices = ' ¥ ' + self.data.msgData.price.toFixed(2)
        ctx.setFontSize(12);
        ctx.setFillStyle('#E7A131');
        ctx.setTextAlign('left');
        ctx.fillText(prices, 34, 410);*/
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        this.setData({
            objid: options.objid,
            objtype: options.objtype,
        });

        wx.showLoading({
            title: '正在生成图片',
        });

        wx.getImageInfo({
            src: that.data.qrcode,
            success(res) {
                that.setData({
                    qrcode: res.path
                })
                that.deliciousDetail(that.data.objtype);
            },
            fail(res) {

            }
        });
    },

    deliciousDetail(type) {
        let that = this;
        common.requestPosts(api.deliciousDetail, {
            memberId: app.globalData.memberId,
            objId: that.data.objid,
            objType: that.data.objtype,
            pageNum: 1
        }, res => {

            if(type == 0) {
                if (that.data.deliciousDetail == '') {
                    that.setData({
                        deliciousDetail: res.data.data,
                    })
                }

            } else {
                that.setData({
                    deliciousDetail: res.data.data,
                })
            }

            that.canvas();
        })
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
        return getApp().sharePage('pages/home/index');
    }
});