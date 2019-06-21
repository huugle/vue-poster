<template>
    <div class="poster">
       <label for="uploads"  class="mask"  style="background-color:#3d7c71;" :class='{"hide":!showtips}'  @click="hideTips">
            <img :src="`./img/bg/bg.jpg`" style="width: 100%;">
       </label>
        <div class="preview" :style="{width: w+'px',height: h+'px',}" v-show="!modelSrc">
            <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="false" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :fixedBox="option.fixedBox" :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :centerBox="option.centerBox" :high="option.high" :infoTrue="option.infoTrue" :maxImgSize="option.maxImageSize" :enlarge="option.enlarge" :mode="option.mode" @realTime="realTime" id="cropper"></vueCropper>
                <img :src="bgurl" alt="" class="preview-bg">
               
        </div>
        <div class="options" v-show="!modelSrc">
            <label class="btn opt" for="uploads">
            <img :src="`./img/icon/add.svg`" alt="">
            <em> 选择照片</em>
            <input type="file" id="uploads" style="position:absolute;opacity: 0;;top:0;left:0;width: 100%;height: 100%;" accept="image/*" ref="uploads" @change="uploadImg($event, 1)">
        </label>
    
            
            <span class="btn"  @click="editShow=true"><img :src="`./img/icon/edit.svg`" alt=""> <em>编辑</em></span>
            <span  :class='{"disabled":!option.img}' class="btn up" @click="finish('blob')" ><img :src="`./img/icon/out.svg`" alt=""><em>生成海报</em></span>
        </div>

      <div class="poster-out" v-show="!!modelSrc">
        <div class="tips">
            长按保存图片,可以分享到朋友圈哦~
        </div>
          <img :src="modelSrc" v-show="modelSrc" style="display: block;max-width: 100%;">
           <!--  <img :src="`./img/bg/tips2.png`" style="width: 100%;" alt=""> -->
      </div>
       <div id="dialog" class="dialog js-is-active" v-if="hintData.show">{{hintData.msg}}</div>
    
     <div class="edit-box" :class='{"show":editShow}'>
                    <div class="edit-mod">
                        <div class="tt">
                        选择海报框
                    </div>
                    <div class="snap-list">
                        <span class="snap-item" v-for="item in bgList" @click="selectSnap(item)">
                            <img :src="`./img/bg/${item}.png`" alt="">
                        </span>
                    </div>
                    <div class="tt">
                        更多功能
                    </div>
                     <div class="snap-list">
                       <span class="btn" @click="rotateLeft" ><img :src="`./img/icon/rate.svg`" alt=""> <em>旋转照片</em></span>
                    </div>
                    </div>
                    <div class="close" @click="editShow=false">
                         <img :src="`./img/icon/close.svg`" style="height:30px" alt="">
                    </div>
                </div>
        <div class="mask" v-show="!showtips && showtip" @click="hideTip">
            <img :src="`./img/bg/tips.png`" style="width: 100%;">
       </div>
    </div>
</template>
<script>
import { VueCropper } from "vue-cropper"
const BGCOUNT = 12;
let generateNumberArray =  function(num){
            let result  = []
            for(let i =0;i<=num;i++){
                result.push(i)
            }
            return result;
        }
const BGLIST = generateNumberArray(BGCOUNT)


export default {
    name: 'hello',
    data() {
        return {
            hintData: {
                show: false,
                msg: '',
                skin: 'default',
                timeout: null
            },
            editShow:false,
            loading: false,
            showtips:true,
            showtip:false,
            previews: {},
            pw:800,
            ph:1422,
            w:336,
            h:600,
            random:Math.floor(Math.random()*BGCOUNT+1),
            model: false,
            modelSrc: "",
            bgList:BGLIST,
            option: {
                img: "",
                size: 1,
                full: false,
                outputType: "png",
                canMove: true,
                fixedBox: true,
                original: false,
                canMoveBox: false,
                autoCrop: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 800,
                autoCropHeight: 1422,
                centerBox: false,
                high: true,
                cropData: {},
                enlarge: 1,
                mode: 'contain',
                maxImgSize: 800
            },
        }

    },
    created() {

        if(localStorage && !localStorage.showtip){
            this.showtip=true
        }
       
        let _this = this;
         window.onresize = () => {
            return (() => {
               _this.resize()
            })()
        }
         _this.resize()
    },
    computed: {
        bgurl(){
            let random =this.random;
            return `./img/bg/${random}.png`
        }

    },
    methods: {
        resize(){
            let fw = document.body.clientWidth;
            let fh = document.body.clientHeight-100;
            let rh = fw/this.pw*this.ph;

            //根据宽高比来定义div大小
            this.h = Math.min(fh,rh);
            this.w = this.h*this.pw/this.ph; 
        },
        selectSnap(index){
            this.random=index;
            this.editShow=false;
        },
        hint(msg) {
            let hint = this.hintData;
            hint.msg = msg;
            hint.show = true;
            hint.timeout = null;
            hint.timeout = setTimeout(function() {
                hint.show = false;
                hint.timeout = null;
            }, 3000);
        },
        hideTips(){
            this.showtips=false;
            
            this.$refs.uploads.click();
        },
        hideTip(){
            this.showtip=false;
            localStorage.showtip=true;
        },
        rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
        uploadImg(e, num) {
            //上传图片
            // this.option.img
            var file = e.target.files[0];
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                this.hint("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
                return false;
            }
            var reader = new FileReader();
            reader.onload = e => {
                let data;
                if (typeof e.target.result === "object") {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]));
                } else {
                    data = e.target.result;
                }
                if (num === 1) {
                    this.option.img = data;
                } else if (num === 2) {
                    this.example2.img = data;
                }
            };
            // 转化为base64
            // reader.readAsDataURL(file)
            // 转化为blob
            reader.readAsArrayBuffer(file);
        },
        // 实时预览函数
        realTime(data) {
            this.previews = data;
        },
        finish(type) {
            if(!this.option.img){
                return this.hint('请选择照片')
            }
            // 输出
            this.$refs.cropper.getCropBlob(data => {
                var _this = this;
                var img = window.URL.createObjectURL(data);
                var c = document.createElement("canvas");
                var ctx = c.getContext("2d");
                c.width = this.pw;
                c.height = this.ph;
                ctx.rect(0, 0, c.width, c.height);
                var img = new Image();
                img.src = window.URL.createObjectURL(data);
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, c.width, c.height);
                    var img2 = new Image();
                    img2.src = _this.bgurl;
                    img2.onload = function() {
                        ctx.drawImage(img2, 0, 0, c.width, c.height);
                        _this.modelSrc = c.toDataURL("image/png", 0.8);
                    };
                };

            });
        },
    },
    components: {
        VueCropper
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.poster {
   height: 100%;
}
.mask{position: fixed;left: 0;top: 0;z-index: 11;height: 100%;width:100%;background-color: rgba(0,0,0,0.75);

   opacity: 1;
   visibility: visible;
   -webkit-transition: 0.35s;
  -webkit-transform: scale(1) translateZ(0);  
   

}

.mask.hide{
   opacity: 0;
   visibility: hidden;
   -webkit-transform: scale(0.5) translateZ(0);
}
.preview{
      position: relative;
    margin: 0 auto;
    background-color: #f8f8f8;
    -webkit-transition: 0.35s;
    
}




.options{min-height:60px;padding:10px;margin-top: 10px;box-shadow: 0 -2px 2px 0 rgba(0,0,0,.03);position: relative;}

.preview-bg {
    background-position: 0 0;
    background-repeat: no-repeat;
    height: 100%;
    width:100%;
    position: absolute;
    left: 0;top: 0;
    -webkit-background-size: contain;
    background-size: contain;
}

#imgbg {
    z-index: 2;
    top: 0;
    position: absolute;
}
#cropper{background: transparent;}
#cropper .cropper-view-box{outline-color:transparent;}
#cropper .cropper-drag-box {
    z-index: 5;
    background: transparent;
}
.btn{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    text-align: center;
    color: #5a5e66;
    -webkit-appearance: none;
    text-align: center;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    font-size: 12px;
     padding: 5px 10px;
    position: relative;
    overflow: hidden;  
}

.btn img{width:25px;}
.btn em{font-style: normal;display: block;margin-top: 10px;}
.btn.up{
     background: #e2264d;
      color: #fff;
      position: absolute;
      right: 10px;
}


.btn.disabled{
    background-color: #ccc;
    border-color: #eee;
}

.poster-out{
    position: relative;
    -webkit-animation:show 0.5s ease-out;
}

.poster-out .tips{
    position: absolute;
    top: 0;
    left: 0;
    background-color:rgba(0,0,0,0.7);
    color: #fff;
    text-align: center; 
    width: 100%;
    padding:5px;

}
@-webkit-keyframes show {
    0% {
      opacity:.7; 
      -webkit-transform: scale(1.4) translateZ(0);
    }
    60%{
        opacity: 0.9;
         -webkit-transform: scale(0.8) translateZ(0);
    }

    100% {
         -webkit-transform: scale(1) translateZ(0);
       opacity: 1; 
    }
}

@-webkit-keyframes hide {
    0% {
        opacity: 1;
         -webkit-transform: scale(1) translateZ(0);

    }
    100% {
        opacity: 0;
         -webkit-transform: scale(0.5) translateZ(0);
    }
}

.edit-box{
    background-color:rgba(255,255,255,.8);
    position: fixed;height:  100%;
    top: 0;
    left: 0;
    width: 100%;
    
    z-index: 11;
    visibility: hidden;
    opacity: 0;
    -webkit-transition: 0.35s;
            -webkit-transform: translate(0,100%) translateZ(0);
            
    
}
.edit-box.show{
     -webkit-transform: translate(0,0) translateZ(0);
    visibility: visible;
    opacity: 1;
}
.edit-mod{height:calc( 100vh - 60px);
    overflow: hidden;
    overflow-y: auto;}
.edit-box:after{
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  background: #ddd;
  width: 100%;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.edit-box .tt{font-size: 14px;padding:10px 5px 5px 0;font-weight: bold;display: inline-block;border-bottom:1px solid #e2264d;margin-bottom: 10px;margin-left: 10px;color: #333;}
.snap-item{display: inline-block;background-color: #000;width:20%;margin: 2%}
.snap-item img{width: 100%;height: auto}
.snap-list .btn{margin-left: 5px;}
.edit-box .close{box-shadow: 0 -2px 2px 0 rgba(0,0,0,.03);background-color: #fff;height:60px;line-height: 60px;text-align: center; }
</style>