<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select(2, $event)" class="block positive" :class="{'active': selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0, $event)" class="block positive" :class="{'active': selectType === 0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
      <span @click="select(1, $event)" class="block negative" :class="{'active': selectType === 1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div @click="toggle" class="switch" :class="{'on': onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script>
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
  data () {
    return {
      // onlyContent: false
    }
  },
  props: {
    onlyContent: {
      type: Boolean,
      default: false
    },
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  computed: {
    positive () {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negative () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  methods: {
    select (type, event) {
      this.$emit('select', type)
    },
    toggle (event) {
      this.$emit('toggle')
    }
  }
}
</script>
<style lang="sass">
.ratingselect
  .rating-type
    padding: 18px 0
    margin: 0 18px
    border-bottom: 1px solid rgba(7, 17, 27, .1)
    font-size: 0
    .block
      display: inline-block
      padding: 8px 12px
      margin-right: 8px
      border-radius: 1px
      line-height: 16px
      font-size: 12px
      color: rgb(77, 85, 93)
      .count
        font-size: 8px
        margin-left: 2px
      &.active
        color: #fff
      &.positive
        background-color: rgba(0, 160, 220, .2)
        &.active
          background-color: rgb(0, 160, 220)
      &.negative
        background-color: rgba(77, 85, 93, .2)
        &.active
          background-color: rgb(77, 85, 93)
  .switch
    padding: 12px 18px
    line-height: 24px
    border-bottom: 1px solid rgba(7, 17, 27, .2)
    color: rgb(77, 85, 93)
    font-size: 0
    color: #b7bbbf
    &.on
      .icon-check_circle
        color: #00c850
    .icon-check_circle
      display: inline-block
      vertical-align: top
      margin-right: 4px
      font-size: 24px
    .text
      font-size: 12px
</style>
