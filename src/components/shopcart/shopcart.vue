<template>
<div>
  <div class="shopcart">
    <div class="content">
      <div class="content-left" @click.stop.prevent="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <span class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></span>
          </div>
          <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalCount > 0}">￥{{totalPrice}}</div>
        <div class="desc">配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="jisSuan()">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index" >
          <transition name="drop" tag="div" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hock"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold-list">
        <div class="shopcart-list" v-show="fold">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click.stop.prevent="empty()">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontorl :food="food" @carttarget="addFood"></cartcontorl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
  <transition name="fade">
    <div class="list-mask" v-show="fold" @click="hideMask"></div>
  </transition>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontorl from '../cartcontrol/cartcontrol'
export default {
  data () {
    return {
      balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
      dropBalls: [],
      fold: false
    }
  },
  components: {
    cartcontorl
  },
  props: {
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            price: 10,
            count: 2
          }
        ]
      }
    },
    deliveryPrice: {Number, default: 0},
    minPrice: {Number, default: 0}
  },
  methods: {
    // el是父组件传过来的target，也就是加号的dom
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hideMask () {
      this.fold = false
    },
    jisSuan () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`已支付${this.totalPrice}元`)
    },
    addFood (target) {
      this.drop(target)
    },
    beforeEnter (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          let inner = el.getElementsByClassName('inner-hock')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    },
    enter (el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        let inner = el.getElementsByClassName('inner-hock')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translate3d(0, 0, 0)'
        el.addEventListener('transitionend', done)
      })
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元`
      } else {
        return '去结算'
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'no-enough'
      } else {
        return 'enough'
      }
    }
  },
  watch: {
    totalCount () {
      if (!this.totalCount) {
        this.fold = false
        return false
      }
    },
    fold () {
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {click: true})
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  }
}
</script>

<style lang="sass">
.shopcart
  width: 100%
  height: 46px
  position: fixed
  left: 0
  bottom: 0
  z-index: 50
  .content
    height: 100%
    display: flex
    background-color: #141d27
    .content-left
      flex: 1
      display: flex
      .logo-wrapper
        flex-shrink: 0
        display: inline-block
        position: relative
        top: -10px
        margin: 0 5px 0 12px
        padding: 6px
        width: 56px
        height: 56px
        border-radius: 50%
        box-sizing: border-box
        vertical-align: top
        background-color: #141d27
        .logo
          width: 100%
          height: 100%
          text-align: center
          border-radius: 50%
          background-color: #2b343c
          &.highlight
            background-color: rgb(0, 120, 204)
          .icon-shopping_cart
            line-height: 44px
            font-size: 24px
            color: #80858a
            &.highlight
              color: #fff
        .num
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 16px
          font-size: 9px
          font-weight: 700
          color: #fff
          background-color: rgb(240, 20, 20)
          box-show: 0 4px 8px 0 rgba(0, 0, 0, .4)
      .price
        flex-shrink: 1
        display: inline-block
        vertical-align: top
        margin-top: 12px
        padding-right: 12px
        border-right: 1px solid rgba(255, 255, 255, .1)
        font-size: 16px
        font-weight: 700
        color: rgba(255, 255, 255, .4)
        box-sizing: border-box
        line-height: 24px
        &.highlight
          color: #fff
      .desc
        flex-shrink: 1
        display: inline-block
        vertical-align: top
        margin: 12px 0 0 10px
        line-height: 24px
        font-size: 14px
        color: rgba(255, 255, 255, .4)
    .content-right
      flex-shrink: 1
      flex: 0 0 105px
      width: 105px
      .pay
        line-height: 46px
        text-align: center
        font-size: 14px
        font-weight: 700
        color: rgba(255, 255, 255, .4)
        &.no-enough
          background-color: #2b343c
        &.enough
          background-color: #00b43c
          color: #fff
  .ball-container
    .ball
      position: fixed
      left: 32px
      bottom: 22px
      z-index: 120
      transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
        width: 16px
        height: 16px
        border-radius: 50%
        background-color: rgb(0, 160, 220)
        transition: all .4s linear
  .shopcart-list
    position: absolute
    left: 0
    top: 0
    z-index: -1
    width: 100%
    transform: translate3d(0, -100%, 0)
    &.fold-list-enter-active, &.fold-list-leave-active
      transition: all .5s
    &.fold-list-enter, &.fold-list-leave-active
      transform: translate3d(0, 0, 0)
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background-color: #f3f5f7
      border-bottom: 1px solid rgba(7, 17, 27, .1)
      .title
        float: left
        font-size: 14px
        color: rgb(7, 17, 27)
      .empty
        float: right
        font-size: 12px
        color: rgb(0, 160, 220)
    .list-content
      padding: 0 18px
      max-height: 217px
      overflow: hidden
      background-color: #fff
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        .name
          line-hright: 24px
          font-size: 14px
          color: rgb(7, 17, 27)
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .cartcontrol-wrapper
          position: absolute
          bottom: 6px
          right: 0
.list-mask
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 40
  transition: all .5s
  backdrop-filter: blur(10px)
  opacity: 1
  background-color: rgba(7, 17, 27, .6)
  &.fade-enter-active, .fade-leave-active
    transition: all .5s
  &.fade-enter, .fade-leave-active
    opacity: 0
    background-color: rgba(7, 17, 27, 0)
</style>
