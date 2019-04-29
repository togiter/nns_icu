<template>
<div style="backgroud-color:red" class="list">
<p>{{total}}</p>
 <div class="scroll-list-wrap">
   <scroll ref="scroll"
           :data="list"
           :scroll-events="['scroll']"
           :options="options"
           @pulling-down="onPullingDown"
           @pulling-up="onPullingUp"
           @scroll="onScrollHandle">
     <ul class="list-wrapper">
         <br>
         <li v-for="item in list" :key="item.name" class="list-item">{{item.name}}--{{item.addr}}--{{item.workSystem}}</li>
         </ul>
   </scroll>
 </div>
</div>
</template>

<script>
 /*
 Scroll 组件还支持下拉刷新和上拉加载的能力。默认无下拉刷新/上拉加载，可通过options传递配置项pullDownRefresh和pullUpLoad开启相应功能。
 开启后，下拉时，Scroll 组件会展示默认下拉动画以及派发pulling-down事件，你可以监听pulling-down事件更新数据。
 同理，开启上拉加载后，可通过pulling-up事件更新数据。

pullDownRefresh的相关配置有：下拉阈值（threshold）, 回弹位置（stop）, 更新成功文案（txt）和文案显示时间（stopTime）。
pullDownRefresh和pullUpLoad对象的所有配置项和含义见 Props 配置
  */
    import {web3QueryEnterpriseName,web3GetEnterprisesCount,web3GetEnterprise} from './../dapp/web3/icu-contract'
    import Scroll from "cube-ui/src/components/scroll/scroll";
    const PAGE_SIZE = 30; //页数
    export default {
        name: "list",
        components: {Scroll},
        data(){
            return {
                loading:false,
                pageNo:1,    //当前页
                total:0,  //总条数
                list:[],
                optionsObj: {
                    pullDownRefresh: {
                        threshold: 45,
                        stop: 40,
                        txt: "更新成功",
                    },
                    pullUpload:{
                        threshold: 45,
                    },
                },
            }
        },
        computed:{
          options(){
            return this.optionsObj;
          }
        },
        created(){
            console.log('wecome list');
            this.getCount();
        },
        methods:{
            //下拉
            onPullingDown(){
                console.log('onPullingdown');
            },
            //上拉
            onPullingUp(){
                console.log('onPullingUp');
            },

            onScrollHandle(pos){
                console.log("scroll pos",pos);
            },

            //获取区块链企业数量
            getCount(){
                web3GetEnterprisesCount((err,result)=>{
                    if(err){
                        console.log("error for ents count：",err);
                        return;
                    }
                    let count = result;
                    console.log('count',count);
                    this.total = count;
                    this.getEnterprises(this.pageNo);

               });
            },

            //搜索企业
            queryEnterprise(name){

            },
            //获取分页企业
            getEnterprises(pageNo){
                // if(this.loading==true) return;
                // this.loading = true;
                let page = Math.max(1,pageNo);
                //当前已存在的数量
                const count = this.list.length;
                let remain = count + Math.min(PAGE_SIZE,this.total-count);
                console.log('count',count,remain);
                //企业Id从1开始
                for (let i = Math.max(1,count);i <= remain;++i){
                    web3GetEnterprise(i,(err,result)=>{
                
                        if(!err){
                            this.list.push(JSON.parse(result));
                            // this.loading = false;
                        }
                    });

                }

            },
            //加载下一页
            loadNextPage(){
                if(PAGE_SIZE * this.pageNo >= this.total){
                    console.log("没有更多可以加载");
                    return;
                }
                this.pageNo++;
                this.getEnterprises(this.pageNo,this.pageSize);
            }

        }
    }
</script>

<style scoped>
.scroll-list-wrap{
    background-color: aquamarine;
     height: 450px;
}
</style>
