// pages/cart/cart.js
const app = getApp()

Page({
  data: {
    recommend: {
      list: []
    },
    cartList: [],
    selectedCount: 0,
    totalPrice: 0,
  },

  onLoad() {
    this.getRecommendProduct();
    this.getCartList();
  },

  // 添加/删除/修改购物车数量
  changeNum(e) {
    const item = e.currentTarget.dataset.item;
    const type = e.currentTarget.dataset.type;
    switch(type) {
      case 'input':
        item.quantity = e.detail.value;
        break;
      case 'add':
        item.quantity ++;
        break;
      case 'reduce':
        item.quantity --;
        break;
    }

    // 删除商品
    if( item.quantity < 1) {
      app.store.cloudApi.deleteCartItem(item).then(res => {
        this.getCartList();
      }).catch(err => {
        console.log('删除购物车信息失败', err);
      })
    }

    app.store.cloudApi.updateCart(item).then(res => {
      this.getCartList();
    }).catch(err => {
      console.log('获取购物车信息失败', err);
    })
  },

  // 获取购物车列表
  getCartList() {
    app.store.cloudApi.getCartList().then(res => {
      const {data} = res;
      let totalPrice = 0, selectedCount = 0;
      for(const {retailPrice,quantity } of data) {
        totalPrice += (retailPrice * quantity);
        selectedCount++
      }
      this.setData({
        cartList: data,
        totalPrice,
        selectedCount
      })
    }).catch(err => {
      console.log('获取购物车信息失败', err);
    })
  },

  // 推荐商品
  getRecommendProduct() {
    app.store.cloudApi.getRecommendProduct({}).then(r => {
      this.setData({
        recommend: {
          list: r.data
        }
      })
    })
  },


  // 点击下单按钮
  confirmOrder() {
    console.log('下单');
  },

})
