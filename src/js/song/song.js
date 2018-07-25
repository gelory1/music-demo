{
    let view = {
        el: '.page',
        template: `
        <div class="wrapper">
            <div class="bkg-cover"></div>
            <audio src={{url}}></audio>
            <header>
                <div class="logo">
                </div>
            </header>
                <main>
                    <div class="songPlayWrapper">
                        <div class="songPlay">
                            <div class="songCover">
                                <img src="{{cover}}">
                                <div class="playLogo">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lyricWrapper">
                        <h3>{{name}}</h3>
                        <div class="lyric">
                            <div class="lines">
                            </div>
                        </div>
                    </div>
                </main>
            <footer class="openAndDownload">
                <button class="openButton">打开</button>
                <button class="downloadButton">下载</button>
            </footer>
        </div>
        `,
        render(data) {
            $(this.el).html(
                this.template.replace('{{url}}',data.url)
                .replace('{{cover}}',data.cover)
                .replace('{{name}}',data.name)
            )

            let {lyrics} =data
            let array = lyrics.split('\n')
            let lines = $(this.el).find('.lines')[0]
            for(let i=0;i<array.length;i++){
                let a = array[i].substring(1).split(']')
                let b = a[0].split(':')
                let time = b[0]*60 + (+b[1])
                $(lines).append(`<p song-time=${time}>${a[1]}</p>`)
            }

            let audio = $(this.el).find('audio')[0]
            audio.onended =()=>{
                window.eventHub.emit('songEnd')
            }
            audio.ontimeupdate = ()=>{
                this.stepLyrics(audio.currentTime)
            }
            let bkg = $(this.el).find(`.bkg-cover`)[0]
            $(bkg).css('background-image',`url(${data.cover})`)
            
        },
        play(){
            let audio = $(this.el).find('audio')[0]
            audio.play()
            this.active('.songPlayWrapper')
            this.active('.songCover')
            this.active('.playLogo')
        },
        pause(){
            let audio = $(this.el).find('audio')[0]
            audio.pause()
            this.deactive('.songPlayWrapper')
            this.deactive('.songCover')
            this.deactive('.playLogo')
        },
        active(selector){
            let element = $(this.el).find(selector)[0]
            $(element).addClass('active')
        },
        deactive(selector){
            let element = $(this.el).find(selector)[0]
            $(element).removeClass('active')
        },
        stepLyrics(time){
            let lines = $(this.el).find('.lines')[0]
            let arrP = $(this.el).find('.lines p')
            for(let i=0;i<arrP.length;i++){
                let currentTime = arrP.eq(i).attr('song-time')
                let nextTime = arrP.eq(i+1).attr('song-time')
                if(currentTime <= time && nextTime > time){
                    let height = lines.getBoundingClientRect().top -arrP[i].getBoundingClientRect().top
                    if(height < (-20)){
                        height = height + 20
                    }
                    $(lines).css('transform', `translateY(${height}px)`)
                    arrP.eq(i).addClass('active')
                    if(i>=1){
                        arrP.eq(i-1).removeClass('active')
                    }
                }else if(time >= arrP.eq(arrP.length-1).attr('song-time')){
                    arrP.eq(arrP.length-2).removeClass('active')
                    arrP.eq(arrP.length-1).addClass('active')
                }
                
            }
        }
    }
    let model = {
        data: {
            id: '',
            singer: '',
            name: '',
            url: '',
            cover: '',
            lyrics: ''
        },
        status: 'pause',
        setId(id) {
            this.data.id = id
        },
        getData(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((data) => {
                Object.assign(this.data, { id: id, ...data.attributes})
                return data
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.findId()
            this.model.setId(id)
            this.model.getData(id).then(() => {
                this.view.render(this.model.data)   
            })
            this.bindEvents()
            window.eventHub.on('songEnd',()=>{
                this.view.pause()
            })
        },
        bindEvents(){
            $(this.view.el).on('click','.songPlayWrapper',()=>{
                this.view.play()
                this.model.status = 'play'
            })
            $(this.view.el).on('click','.songPlayWrapper.active',()=>{
                this.view.pause()
                this.model.status = 'pause'
            })
            
        },
        findId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            let id = ''
            let arr = search.split('&')
            for (let i = 0; i < arr.length; i++) {
                let kv = arr[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        }
    }
    controller.init(view, model)
}