{
    let view ={
        el: '.page main section.uploadSong',
        find(selector){
            return $(this.el).find(selector)[0]
        },
        template: `
            <div class="upload">
                <div id="uploadButtonWrapper">
                    <button id="uploadButton">选择文件</button>
                    <div>可将文件拖拽至此处直接上传，文件大小不能超过10MB</div>
                </div>
            <div id="uploadStatus"></div>
            </div>
        `,
        render(data = {}){
            $(this.el).html(this.template)
            if(data.id){
                $(this.el).html('<h2>网易云音乐后台管理-编辑歌曲</h2>')
            }else{
                $(this.el).prepend('<h2>网易云音乐后台管理-新建歌曲</h2>')
            }
        }
    }
    let model = {
        data: {
            name: '',singer: '',url: '',id: ''
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.uploadInit()
            window.eventHub.on('select',(data)=>{
                this.model.data = data.data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.model.data = {name: '',singer: '',url: '',id: ''}
                this.view.render(this.model.data)
                this.uploadInit()
            })
        },
        uploadInit(){
            var uploader = Qiniu.uploader({
                runtimes: 'html5',      
                browse_button: this.view.find('#uploadButton'),         
                uptoken_url: 'http://localhost:8888/uptoken', 
                get_new_uptoken: false,
                domain: 'pbxrrj7bh.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
                container: this.view.find('#uploadButtonWrapper'),             // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: '10mb',             // 最大文件体积限制
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: this.view.find('#uploadButtonWrapper'),          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后，处理相关的事情
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        window.eventHub.emit('beforeLoading')
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时，处理相关的事情
                        uploadStatus.textContent = '上传中'
                    },
                    'FileUploaded': function (up, file, info) {
                        uploadStatus.textContent = '上传完毕'
                        // 每个文件上传成功后，处理相关的事情
                        window.eventHub.emit('afterLoading')
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = 'http://' + domain + "/" + encodeURIComponent(response.key);
                        window.eventHub.emit('upload',{
                            name: response.key,
                            url: sourceLink
                        })
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时，处理相关的事情
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后，处理相关的事情
                    }
                }
            });
        }
    }
    controller.init(view,model);
}