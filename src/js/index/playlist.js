{
    let view = {
        el: 'body',
        templateHeader: `

        <div class="playListInfo">
            <div class="infoBkg" style="background-image:url('{{cover}}')"></div>
            <div class="imgCover">
                <img src="{{cover}}">
                <div class="songTimes">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-headphone_f"></use>
                    </svg>
                    <span>78万</span>
                </div>
            </div>
            <div class="playlistRightWrapper">
                <div class="playListName">{{name}}</div>
                <div class="playListUploader">
                    <div class="head">
                        <img src="{{cover}}">
                    </div>
                    <div class="uploader">{{uploader}}</div>
                </div>
            </div>
        </div>
        <div class="playListSummary">
            {{summary}}
        </div>
        `,
        templateMain: `
        <li>
            <a href="./song.html?id={{id}}">
                <div class="songNumber">{{number}}</div>
                <div class="songInfo">
                    <div class="songName">{{name}}</div>
                    <div class="songSinger">
                        <div class="SQ"></div>{{singer}}
                    </div>
                </div>
                <div class="songPlayLogo"></div>
            </a>
        </li>
        `,
        renderHeader(data) {
            let html = this.templateHeader.replace(/{{cover}}/g,data.cover)
            .replace('{{name}}',data.name)
            .replace('{{uploader}}',data.uploader)
            .replace('{{summary}}',data.summary)
            
            $(this.el).find('header').eq(0).html(html)
        },
        renderMain(data) {
            let songs = data
            let number = 1
            songs.map((song) => {
                let html = this.templateMain.replace('{{name}}', song.attributes.name)
                    .replace('{{singer}}', song.attributes.singer)
                    .replace('{{id}}', song.id).replace('{{number}}', number)
                $(this.el).find('ul').append(html)
                number += 1
            })
        }
    }
    let model = {
        data: {
            songs: [],
            playlist: {}
        },
        findSongs(data){
            var query = new AV.Query('Song');
            return query.equalTo('dependent', data).find().then((songs) => {
                this.data.songs = songs
            })
        },
        getPlaylist(id){
            var query = new AV.Query('Playlist');
            return query.get(id).then((playlist)=>{
                this.data.playlist = {id,...playlist.attributes}
            })
        }
    }
    let controller = {
            init(view, model) {
                this.view = view
                this.model = model
                let id = this.findId()
                this.model.getPlaylist(id).then(()=>{
                    this.view.renderHeader(this.model.data.playlist)
                    this.model.findSongs(this.model.data.playlist).then(()=>{
                        this.view.renderMain(this.model.data.songs)
                    })
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