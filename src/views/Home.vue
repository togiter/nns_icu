<template>
  <div class="home">
    <button @click="gotoEntSave">添加企业</button>
    <button @click="gotoList">企业列表</button>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {

  },
    methods:{

        gotoEntSave:function () {
            this.$router.push({
                path:'/save',
                query:{}
            })
        },
        gotoList:function () {
            this.$router.push({
                path:'/list',
                query:{}
            })
        }
    }
}
</script>
