<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="gotoUpload">上传</button>
    <cube-button @click="showToast">show toast</cube-button>
  </div>
</template>

<script>
import Button from "cube-ui/src/components/button/button";
export default {
  name: 'HelloWorld',
  components: { Button},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      toastTxt: 'cube toast content'
    }
  },
  methods: {
    gotoUpload(){
      this.$router.push({
        path:'/upload',
        query:{

        }
      })
    },
    showToast () {
      this.$createToast({
        txt: this.toastTxt
      }).show()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
