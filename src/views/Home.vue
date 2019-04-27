<template>
  <div class="home">
    <button @click="gotoEntSave">添加企业</button>
    <button @click="gotoupload">upload</button>
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
        gotoupload:function () {
            this.$router.push({
                path:'/upload',
                query:{}
            })
        }
    }
}
</script>
