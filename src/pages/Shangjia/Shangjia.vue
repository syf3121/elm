<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">( {{seller.ratingCount}} )</span><span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active': favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li v-for="(item, index) in seller.supports" :key="index" class="support-item">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic, index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90" alt="">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info, index) in seller.infos" :key="index">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {saveToLoacl, loadFromLocal} from '../../public/js/store'
import star from '../../components/star/star'
import split from '../../components/split/split'
export default {
  props: {
    seller: {
      type: [Object, Array]
    }
  },
  data () {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  components: {
    star,
    split
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  watch: {
    'seller' () {
      this.$nextTick(() => {
        this._initScroll()
        this._initPics()
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._initScroll()
      this._initPics()
    })
  },
  methods: {
    toggleFavorite (event) {
      if (!event._constructed) {
        return
      }
      this.favorite = !this.favorite
      saveToLoacl(this.seller.id, 'favorite', this.favorite)
    },
    _initScroll () {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    _initPics () {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        let width = (picWidth + margin) * this.seller.pics.length - margin
        this.$refs.picList.style.width = width + 'px'
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical'
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    }
  }
}
</script>

<style lang="sass">
@import '../../public/style/mixin.sass'
.seller
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .overview
    padding: 18px
    position: relative
    .title
      margin-bottom: 8px
      font-size: 14px
      color: rgb(7, 17, 27)
      line-height: 14px
    .desc
      padding-bottom: 18px
      border-bottom: 1px solid rgba(7, 17, 27, .1)
      .star
        display: inline-block
        vertical-align: top
        margin-right: 8px
      .text
        display: inline-block
        vertical-align: top
        margin-right: 12px
        font-size: 10px
        color: rgb(77, 85, 93)
        line-height: 18px
    .remark
      margin-top: 18px
      display: flex
      .block
        flex: 1
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, .1)
        &:last-child
          border-right: none
        h2
          margin-bottom: 4px
          font-size: 10px
          color: rgb(147, 153, 159)
          line-height: 10px
        .content
          font-size: 10px
          color: rgb(7, 17, 27)
          line-height: 24px
          .stress
            font-size: 24px
            font-weight: 200
    .favorite
      position: absolute
      width: 50px
      right: 12px
      top: 18px
      text-align: center
      font-size: 0
      .icon-favorite
        display: block
        line-height: 24px
        margin-bottom: 4px
        font-size: 24px
        color: rgba(77, 85, 93, .5)
        &.active
          color: rgb(240, 20, 20)
      .text
        display: block
        line-height: 10px
        font-size: 10px
        color: rgb(77, 85, 93)
  .bulletin
    padding: 18px 18px 0px
    .title
      margin-bottom: 8px
      font-size: 14px
      color: rgb(7, 17, 27)
      line-height: 14px
    .content-wrapper
      line-height: 22px
      padding: 0 12px 16px
      font-size: 12px
      font-weight: 200
      color: rgb(240, 20, 20)
      border-bottom: 1px solid rgba(7, 17, 27, .1)
    .supports
      .support-item
        padding: 16px 12px
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        font-size: 0
        &:last-child
          border-bottom: none
          padding-bottom: 18px
        .icon
          display: inline-block
          vertical-align: top
          width: 16px
          height: 16px
          background-size: 16px 16px
          background-repeat: no-repeat
          margin-right: 6px
          &.decrease
            @include bg-img('decrease_4')
          &.discount
            @include bg-img('discount_4')
          &.guarantee
            @include bg-img('guarantee_4')
          &.invoice
            @include bg-img('invoice_4')
          &.special
            @include bg-img('special_4')
        .text
          font-size: 12px
          font-weight: 200
          color: (7, 17, 27)
          line-height: 16px
  .pics
    padding: 18px
    .title
      margin-bottom: 12px
      font-size: 14px
      color: rgb(7, 17, 27)
      line-height: 14px
    .pic-wrapper
      width: 100%
      overflow: hidden
      white-space: nowrap
      .pic-list
        font-size: 0
        .pic-item
          display: inline-block
          margin-right: 6px
          width: 120px
          height: 90
          &:last-child
            margin-right: 0
  .info
    padding: 18px 18px 0
    .title
      margin-bottom: 12px
      font-size: 14px
      color: rgb(7, 17, 27)
      line-height: 14px
    .info-item
      padding: 16px 12px
      font-size: 12px
      font-weigth: 200
      color: rgb(7, 17, 27)
      line-height: 16px
      border-top: 1px solid rgba(7, 17, 27, .1)
</style>
