<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-jian" v-show="food.count > 0" @click.stop.prevent="jianCart()">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-jia icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default{
  props: {
    food: {
      type: Object
    }
  },
  created () {},
  methods: {
    addCart (event) {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      // 触发当前实例的事件 给父组件Goods 传参数
      this.$emit('carttarget', event.target)
    },
    jianCart () {
      this.food.count--
    }
  }
}
</script>

<style lang="sass">
.cartcontrol
  font-size: 0
  .cart-jian
    display: inline-block
    padding: 6px
    transition: all .4s linear
    .inner
      font-size: 24px
      line-height: 24px
      display: inline-block
      color: rgb(0, 160, 220)
    &.move-enter-active
      opacity: 1
      transform: translate3D(0, 0, 0)
      .inner
        transition: all .4s linear
        transform: rotate(0)
    &.move-leave-active
      opacity: 1
      transform: translate3D(0, 0, 0)
      .inner
        transition: all .4s linear
        transform: rotate(0)
    &.move-enter
      opacity: 0
      transform: translate3D(24px, 0, 0)
      .inner
        transform: rotate(180deg)
    &.move-leave-active
      opacity: 0
      transform: translate3D(24px, 0, 0)
      .inner
        transform: rotate(180deg)
  .cart-count
    display: inline-block
    vertical-align: top
    width: 12px
    padding-top: 6px
    line-height: 24px
    text-align: center
    font-size: 12px
    color: rgb(147, 153, 159)
  .cart-jia
    display: inline-block
    padding: 6px
    font-size: 24px
    line-height: 24px
    color: rgb(0, 160, 220)
</style>
