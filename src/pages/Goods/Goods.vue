<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <!-- <scrollactive
        active-class="active"
        :offset="174"
        :duration="800"
        bezier-easing-value=".5,0,.35,1"> -->
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{current: currenIndex === index}" @click="selectMenu(index)">
            <a class="text">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</a>
          </li>
        </ul>
      <!-- </scrollactive> -->
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="food-list food-list-hock">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food, $event)" v-for="(food, index) in item.foods" :key="index" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontorl-wrapper">
                  <!-- 通过v-on来监听子组件传过来的方法 -->
                  <cartcontorl :food="food" @carttarget="_cartTarget"></cartcontorl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shop-cart ref="shopCart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shop-cart>
    <food @add="addFood" :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopCart from '../../components/shopcart/shopcart'
import cartcontorl from '../../components/cartcontrol/cartcontrol'
import food from '../food/food'

export default{
  props: {
    seller: {
      type: [Object, Array]
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  components: {
    shopCart,
    cartcontorl,
    food
  },
  computed: {
    currenIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.$http.get('https://easy-mock.com/mock/5acc82be90e9c275cd016832/wellshang/goods').then((res) => {
      if (res.status === 200) {
        this.goods = res.data.goods
        this.$nextTick(() => {
          // 调用better-scroll的初始化函数
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    selectMenu (index) {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hock')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    selectFood (food, event) {
      this.selectedFood = food
      this.$refs.food.show()
    },
    // 传target（这个参数是cartcontrol里的加号的dom）参数给shopcart组件
    _drop (target) {
      this.$nextTick(() => {
        this.$refs.shopCart.drop(target)
      })
    },
    // 通过触发 _cartTarget 事件 接受子组件cartcontrol传过来的值
    _cartTarget (target) {
      this._drop(target)
    },
    addFood (target) {
      this._drop(target)
    },
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true})
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {probeType: 3, click: true})
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hock')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<style lang="sass">
@import '../../public/style/mixin.sass'
.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    height: 100%
    background-color: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 100%
      padding: 0 12px
      box-sizing: border-box
      line-height: 14px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background-color: #fff
        font-weight: 700
        .text
          border-bottom: none
      .text
        display: table-cell
        width: 56px
        vertical-align: middle
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        font-size: 12px
        color: rgb(77, 85, 93)
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-repeat: no-repeat
          background-size: 12px 12px
          &.decrease
            @include bg-img('decrease_3')
          &.discount
            @include bg-img('discount_3')
          &.guarantee
            @include bg-img('guarantee_3')
          &.invoice
            @include bg-img('invoice_3')
          &.special
            @include bg-img('special_3')
  .foods-wrapper
    flex: 1
    background-color: #fff
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background-color: #f3f5f7
    .food-item
      position: relative
      display: flex
      margin: 18px
      padding-bottom: 15px
      border-bottom: 1px solid rgba(7, 17, 27, .1)
      &:last-child
        border-bottom: none
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        width: 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0
          font-size: 14px
          height: 14px
          line-height: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          font-size: 10px
          color: rgb(147, 153, 159)
          line-height: 10px
        .desc
          margin: 8px 0
          line-height: 12px
        .extra
          .count
            display: inline-block
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
        .cartcontorl-wrapper
          position: absolute
          right: -5px
          bottom: 8px
</style>
