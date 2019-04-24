<template>
  <div class="upload">
    <p>文件上传</p>
    <Upload ref="upload"
        :action="action"
        :simultaneous-uploads="2"
        :process-file="processFile"
            :target="targetUrl"
        @file-submitted="fileSubmitted" />
  </div>
</template>

<script>
  import compress from './../modules/image'
  import Upload from "cube-ui/src/components/upload/upload";
  import {dfsAdd,dfsCat} from './../dapp/dfs/dfs'
  import DFS from '@/consts/urls'
  export default {
    name: "upload",
    components: { Upload },
    data(){
      return {
        action:{
          target:DFS,
          prop:'base64Value'
        }
      }
    },
    created(){

    },
    mounted(){

    },
    methods:{
      targetUrl(url){
        console.log('url',url);
      },
      processFile(file,next){
        console.log(file);
        compress(file,{
          compress:{
            with:1600,
            height:1600,
            quality:0.7
          }
        },next);
      },
      fileSubmitted(file){
          file.base64Value = file.file.base64;
          console.log("file",file);
          dfsAdd(file.base64Value,(err,value)=>{
            console.log(err,value);
              dfsCat(value[0].hash,(e,v)=>{
                 console.log("cat",v.toString(),e);
              });
          });
      }
    }

  };
</script>

<style scoped>

</style>
