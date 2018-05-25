<template>
<div class="header-wrapper">
  <div class="header">
    <div class="header-content">
      <div class="shangjia-img">
        <img class="shangjia-icon" width="64" height="64" :src="seller.avatar" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="icon"></span><span class="name">{{seller.name}}</span>
        </div>
        <div class="desciption">
          <span>{{seller.description}}/{{seller.deliveryTime}}分送达</span>
        </div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span><span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="supports-count" v-if="seller.supports" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span><span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="header-gonggao" @click="showDetail">
      <span class="gonggao"></span>
      <span class="text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img width="100%" height="100%" :src="seller.avatar" alt="">
    </div>
    <transition name="detail">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="title">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title-fu">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li v-for="(item, index) in seller.supports" :key="index" class="support-item">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title-fu">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <span class="text">{{seller.bulletin}}</span>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</div>
</template>

<script>
import star from '../star/star'
export default{
  props: {
    seller: {
      type: [Object, Array]
    }
  },
  data () {
    return {
      detailShow: false
    }
  },
  components: {
    star
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    hideDetail () {
      this.detailShow = false
    }
  }
}
</script>

<style lang="sass">
@import '../../public/style/mixin.sass'
.header-wrapper
  .header
    position: relative
    top: 0
    left: 0
    overflow: hidden
    width: 100%
    display: flex
    flex-direction: column
    background-color: rgba(7, 17, 27, .5)
    color: #fff
  .header-content
    height: 64px
    position: relative
    display: flex
    z-index: 10
    margin: 24px 12px 18px 24px
    .shangjia-img
      margin-right: 16px
      .shangjia-icon
      border-radius: 2px
    .content
      margin: 2px 0
      font-size: 14px
      .title
        .icon
          display: inline-block
          vertical-align: top
          width: 30px
          height: 18px
          margin-right: 6px
          @include bg-img('brand')
          background-repeat: no-repeat
          background-size: 30px 18px
        .name
          line-height: 16px
          font-size: 16px
          font-weight: 700
      .desciption
        line-height: 12px
        margin: 8px 0 10px 0
        font-size: 12px
        font-weight: 200
      .supports
        font-size: 10px
        line-height: 12px
        font-weight: 200
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 4px
          background-repeat: no-repeat
          background-size: 12px 12px
          &.decrease
            @include bg-img('decrease_1')
          &.discount
            @include bg-img('discount_1')
          &.guarantee
            @include bg-img('guarantee_1')
          &.invoice
            @include bg-img('invoice_1')
          &.special
            @include bg-img('special_1')
    .supports-count
      position: absolute
      right: 12px
      bottom: -3px
      height: 24px
      padding: 0 4px 0 8px
      line-height: 24px
      border-radius: 14px
      text-align: center
      font-size: 10px
      background-color: rgba(0, 0, 0, .2)
      .icon-keyboard_arrow_right
        font-size: 10px
  .header-gonggao
    position: relative
    height: 28px
    z-index: 10
    line-height: 28px
    padding: 0 22px 0 12px
    background-color: rgba(7, 17, 27, .2)
    font-size: 10px
    font-weight: 200
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    .gonggao
      display: inline-block
      vertical-align: top
      margin-top: 8px
      margin-right: 4px
      width: 22px
      height: 12px
      @include bg-img('bulletin')
      background-repeat: no-repeat
      background-size: 22px 12px
    .icon-keyboard_arrow_right
      font-size: 12px
      position: absolute
      right: 10px
      top: 8px
  .background
    position: absolute
    top: 0
    left: 0
    z-index: -1
    width: 100%
    height: 100%
    filter: blur(10px)
  .detail-enter-active, .detail-leave-active
    transition: opacity .5s
    background-color: (7, 17, 27, .8)
  .detail-enter, .detail-leave-to
    opacity: 0
    background-color: (7, 17, 27, 0)
  .clearfix
    display: inline-block
    &:after
      display: block
      content: "."
      height: 0
      line-height: 0
      clear: both
      visibility: hidden
  .detail
    position: fixed
    left: 0
    top: 0
    z-index: 100
    width: 100%
    height: 100%
    overflow: auto
    background-color: rgba(7, 17, 27, .8)
    .detail-wrapper
      width: 100%
      min-height: 100%
      .detail-main
        margin-top: 64px
        padding-bottom: 64px
        .title
          line-height: 16px
          font-size: 16px
          font-weight: 700
          text-align: center
        .star-wrapper
          margin-top: 18px
          text-align: center
        .title-fu
          display: flex
          width: 80%
          margin: 28px auto 24px auto
          .line
            flex: 1
            position: relative
            top: -6px
            border-bottom: 1px solid rgba(255, 255, 255, .2)
          .text
            padding: 0 12px
            font-size: 14px
            font-weight: 700
        .supports
          width: 80%
          margin: 0 auto
          .support-item
            padding: 0 12px
            margin-bottom: 12px
            &:last-child
              margin-bottom: 0
            .icon
              display: inline-block
              vertical-align: middle
              width: 16px
              height: 16px
              margin-right: 6px
              background-size: 16px 16px
              background-repeat: no-repeat
              &.decrease
                @include bg-img('decrease_2')
              &.discount
                @include bg-img('discount_2')
              &.guarantee
                @include bg-img('guarantee_2')
              &.invoice
                @include bg-img('invoice_2')
              &.special
                @include bg-img('special_2')
            .text
              line-height: 12px
              font-size: 12px
        .bulletin
          width: 80%
          margin: 0 auto
          padding: 0 12px
          box-sizing: border-box
          font-size: 12px
          font-weight: 200
          line-height: 24px
    .detail-close
      position: relative
      width: 32px
      height: 32px
      margin: -64px auto 0 auto
      clear: both
      font-size: 32px
</style>
