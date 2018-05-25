<template>
  <div id="app">
    <Header :seller="seller"></Header>
    <div class="nav">
      <div class="nav-item">
        <router-link to="/goods" exact class="a">商品</router-link>
      </div>
      <div class="nav-item">
        <router-link to="/ratings" class="a">评价</router-link>
      </div>
      <div class="nav-item">
        <router-link to="/shangjia" class="a">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"/>
    </keep-alive>
  </div>
</template>

<script>
import {urlParse} from './public/js/util'
import Header from './components/Header/Header'
export default {
  name: 'App',
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  components: {
    Header
  },
  created () {
    this.$http.get('https://easy-mock.com/mock/5acc82be90e9c275cd016832/wellshang/seller?id=' + this.seller.id).then((res) => {
      if (res.status === 200) {
        this.seller = Object.assign({}, this.seller, res.data.seller)
      }
    })
  }
}
</script>

<style lang="sass">
@import './public/style/style.css'
@import './public/style/chushihua.css'
.nav
  position: fixed
  top: 134px
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  border-bottom: 1px solid rgba(7, 17, 27, .2)
  font-size: 14px
  color: rgb(77, 85, 93)
  background-color: #fff
  z-index: 10
  .red
    color: rgb(240, 20, 20)
  .nav-item
    flex: 1
    text-align: center
    .a
      display: inline-block
      width: 100%
      height: 100%

</style>
