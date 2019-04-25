<template>
    <div class="save">
        <h2>添加企业</h2>
        <br>
        <Input placeholder="企业名称(阿里爹爹)" v-model="name"></Input>
        <Input placeholder="地址(如杭州某处)" v-model="addr"></Input>
        <Input placeholder="工作制度(如996/995)" v-model="workSystem"></Input>
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
        <Button style="width: 100%;height: 45px;background-color: coral;color: white;border: 0px" type="submit" @click="saveEnterprise">提交</Button>
    </div>
</template>

<script>
    import Input from "cube-ui/src/components/input/input";
    import compress from './../modules/image'
    import Upload from "cube-ui/src/components/upload/upload";
    import {dfsAdd,dfsCat} from './../dapp/dfs/dfs'
    import DFS from './../consts/urls'
    export default {
        name: "save",
        components: {Input,Upload},
        data(){
            return {

                colorType:"",//黑名单/白名单
                colorTypes:['黑名单','白名单','灰名单'],
                name:"",
                addr:"",
                workSystem:"",
                action:{
                    target:DFS,
                    prop:'base64Value'
                }
            }
        },
        created(){
            console.log('fdsfds');
        },
        mounted(){

        },
        methods: {

            //保存企业
            saveEnterprise(){

                console.log('save');
            },
            colorTypeChange(value, index, text) {
                console.log('change', value, index, text)
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
                dfsAdd(file.base64Value, (err, value) => {
                    console.log(err, value);
                    dfsCat(value[0].hash, (e, v) => {
                        console.log("cat", v.toString(), e);
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>
