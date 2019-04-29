<template>
    <div class="save">
        <h2>添加企业<span style="color: gray;font-size: 12px">所有输入均不超过16中文</span></h2>
        <br>
        <Input placeholder="企业名称(阿里爹爹)" v-model="name" />
        <Input placeholder="地址(如杭州某处)" v-model="addr" />
        <Input placeholder="工作制度(如996/995)" v-model="workSystem" />
        <cube-select
                title="名单类型"
                v-model="colorType"
                :options="colorTypes"
                @change="colorTypeChange"
                placeholder='名单类型'
                @click="selectClicked">
        </cube-select>
        <br>
        <div style="margin: 10px 10px;">
         <p style="text-align: left;padding-bottom: 8px;">上传图片<span style="color: gray;font-size: 12px">(公告，截图，其他证据等)</span></p>
        <Upload ref="upload"
                :action="action"
                :simultaneous-uploads="2"
                :process-file="processFile"
                :target="targetUrl"
                @file-submitted="fileSubmitted" />
        </div>
        <Button :disabled="loading==true" style="width: 100%;height: 45px;background-color: coral;color: white;border: 0px" type="submit" @click="saveEnterprise">提交</Button>
    </div>
</template>

<script>
    import Input from "cube-ui/src/components/input/input";
    import compress from './../modules/image'
    import Upload from "cube-ui/src/components/upload/upload";
    import {dfsAdd,dfsCat} from './../dapp/dfs/dfs'
    import DFS from './../consts/urls'
    import {web3SaveEnterprise,web3GetEnterprise,web3GetEnterprisesCount} from './../dapp/web3/icu-contract'
    export default {
        name: "save",
        components: {Input,Upload},
        data(){
            return {
                loading:false,
                colorType:"",//黑名单/白名单
                colorTypes:['黑名单','白名单','灰名单'],
                name:"",
                addr:"",
                workSystem:"",
                imgs:[],//存储图片hash
                action:{
                    target:DFS,
                    prop:'base64Value'
                }
            }
        },
        created(){
            web3GetEnterprisesCount((err,val)=>{

            });
            console.log('fdsfds');
            for(let i = 1;i < 15;i++){
            web3GetEnterprise(i,(err,val)=>{

            });
            }
        },
        mounted(){

        },
        methods: {
        toastText(text){
            const toast = this.$createToast({
            time: 1000,
             txt: text
             })
             toast.show()
        },
            //保存企业
            saveEnterprise(){
                if(this.loading==true){
                    console.log("loading");
                    return;
                }
                const limitNum = 16;
                if(this.name.Trim().lenght <= 0 || this.name.Trim().lenght > limitNum){
                     toastText('输入16字符内的企业名称');
                     return;
                }
                if(this.addr.Trim().lenght <= 0 || this.addr.Trim().lenght > limitNum){
                     toastText('输入16字符内的企业地址');
                     return;
                }
                if(this.workSystem.Trim().lenght <= 0 || this.workSystem.Trim().lenght > limitNum){
                     toastText('输入16字符内的工作制度');
                     return;
                }
                if( Number.parseInt(this.colorType) < 0 || Number.parseInt(this.colorType) >= this.colorTypes.lenght){
                      toastText('选择企业所属的名单类型');
                     return;
                }
                this.loading = true;
                let msg = {
                    name:this.name,
                    addr:this.addr,
                    colorType:this.colorType,
                    workSystem:this.workSystem,
                    imgs:this.imgs
                }
                let msgJson = JSON.stringify(msg);
                console.log('msgjson',msgJson);
                //上传到分布式文件系统获取hash
                dfsAdd(msgJson, (err, values) => {
                    console.log('dfsAdd msgJSON err-value',err, values);
                    let hash = values[0].hash;
                     this.loading = false;
                    web3SaveEnterprise(this.name,hash,(error,result)=>{
                     console.log('error-result',error, result);
                      this.loading = false;
                });
                });
               
            },
            colorTypeChange(value, index, text) {
                console.log('change', value, index, text)
                this.colorType = text;
            },
            selectClicked(){

            },
            targetUrl(url) {
                console.log('url', url);
            },
            processFile(file, next) {
                console.log(file);
                compress(file, {
                    compress: {
                        with: 1600,
                        height: 1600,
                        quality: 0.7
                    }
                }, next);
            },
            fileSubmitted(file) {
                file.base64Value = file.file.base64;
                console.log("file", file);

                dfsAdd(file.base64Value, (err, values) => {
                    /*values [
                     *{hash: "QmehpnnP9KKfV7rhnaKmmZ8rFqBpvhSAtosWb1xEtotwNJ"
                     * path: "QmehpnnP9KKfV7rhnaKmmZ8rFqBpvhSAtosWb1xEtotwNJ"
                     * size: 229}]
                    */
                    console.log(err, values);
                    if(!err){
                        this.imgs.push(values[0].hash);    
                        }
                    dfsCat(values[0].hash, (e, v) => {
                        console.log("cat", v.toString(), e);
                        
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>
