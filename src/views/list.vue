<template>
<div style="backgroud-color:red" class="list">

    <div style="background-color: gainsboro;padding: 12px 10px;text-align: left;vertical-align: center;"><p>上链企业总数:<span class="content-span">{{total}}</span></p>
        <br>
        <div><input style="height: 32px;padding-left: 5px" placeholder="查询企业名称" v-model="searchName"></input><button @click="queryEnterprise" style="background-color: green;height: 32px;width: 55px">查询</button></div>
    </div>
 <div class="scroll-list-wrap">
   <scroll ref="scroll"
           :data="list"
           :scroll-events="['scroll']"
           :options="options"
           @pulling-down="onPullingDown"
           @pulling-up="onPullingUp"
           @scroll="onScrollHandle">
     <ul class="list-wrapper" v-for="(item,i) in list" :key="i">
         <div class="content">
             <p>企业名称:<span class="content-span">{{item.name}}</span></p>
             <br>
             <p>地址:<span class="content-span">{{item.addr}}</span></p>
             <br>
             <p>工作制度:<span class="content-span">{{item.workSystem}}</span></p>
             <br>
             <p>名单类型:<span class="content-span">{{item.colorType}}</span></p>
             <br>
             <p>工作描述:<span class="content-span" style="line-height: 20px" >{{item.desc}}</span></p>
             <br>
             <section v-if="item.imgs.length > 0">
                 <p>证据/证明/截图</p>
             <ul v-for="(url,j) in item.imgs" :key="j">
                 <li ><span style="width: 88%; color: cadetblue;font-size: 13px" @click="catHash(url)">{{url}}</span></li>
             </ul>
             </section>
         </div>
         <hr />
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
 import Input from "cube-ui/src/components/input/input";
 import Button from "cube-ui/src/components/button/button";
    const PAGE_SIZE = 30; //页数
    export default {
        name: "list",
        components: {Button, Input, Scroll},
        data(){
            return {
                searchName:"", //搜索企业名称
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

            //查看图片
            catHash(url){
                console.log('url',url);
                url ='http://127.0.0.1:8080/ipfs/QmfQkD8pBSBCBxWEwFSu4XaDVSWK6bjnNuaWZjMyQbyDub/#/files/IMG_0058.JPG';

            },
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
            queryEnterprise(){
                let name = this.searchName;
                console.log('name',name)
                if(name.trim().length <= 0) return;
                web3QueryEnterpriseName(name,(err,result)=>{
                    if(!err){
                        this.list = [];
                        this.list.push(JSON.parse(result));

                    }
                });
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
   background-color: rgba(0,0,0,0.02);
     height: 100%;
}
    .content{
        text-align: left;
        padding: 12px 12px;
        vertical-align: center;
    }
    .content p{
        font-size: 14px;
        color: gray;
    }
    .content-span{
        font-size: 15px;
        color: black;
        padding-left: 10px;

    }
</style>
