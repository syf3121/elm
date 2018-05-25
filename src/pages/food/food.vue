<template>
<div>
  <transition name="food">
    <div class="food" v-show="showFood" ref="food">
      <div class="food-content">
        <div class="header-img">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <span class="icon-arrow_lift"></span>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-cout">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol @carttarget="addFood" :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop.prevent="addFrist($event)" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="rating-item" v-show="needShow(rating.rateType, rating.text)" v-for="(rating, index) in food.ratings" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" alt="" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
         </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import {formatDate} from '../../filter/date'
import cartcontrol from '../../components/cartcontrol/cartcontrol'
import split from '../../components/split/split'
import ratingselect from '../../components/ratingselect/ratingselect'

const ALL = 2

export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFood: false,
      selectType: 0,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  },
  methods: {
    show () {
      this.showFood = true
      this.selectType = ALL
      this.onlyContent = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {click: true})
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFood = false
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    },
    selectRating (type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent () {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    addFrist (event) {
      this.$emit('add', event.target)
      Vue.set(this.food, 'count', 1)
    },
    addFood (target) {
      this.$emit('add', target)
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style lang="sass">
.food
  position: fixed
  left: 0
  top: 0
  bottom: 46px
  z-index: 30
  width: 100%
  background-color: #fff
  transform: translate3d(0, 0, 0)
  &.food-enter-active, &.food-leave-active
    transition: all .2s linear
  &.food-enter, &.food-leave-active
    transform: translate3d(100%, 0, 0)
  .food-content
    .header-img
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0px
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 16px
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
        line-height: 14px
      .detail
        height: 10px
        margin: 8px 0 18px 0
        font-size: 0
        color: rgb(147, 153, 159)
        line-height: 10px
        .sell-cout
          display: inline-block
          margin-right: 12px
          font-size: 10px
        .rating
          display: inline-block
          font-size: 10px
      .price
        .now
          display: inline-block
          margin-right: 12px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
          line-height: 24px
        .old
          font-size: 10px
          font-weight: 700
          color: rgb(147, 153, 159)
          line-height: 24px
          text-decoration: line-through
    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      border-radius: 12px
      font-size: 10px
      color: #fff
      background-color: rgb(0, 160, 220)
      opacity: 1
      &.fede-enter-active, &.fade-leave-active
        transition: all .5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
