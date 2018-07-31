{
    let view = {
        el: '.page main section.saveSong',
        template: `
        <form>
            <div class="row">
                <label>歌曲</label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label>歌手</label>
                <input name="singer" type="text" value="__singer__">
            </div>
            <div class="row">
                <label>外链</label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row">
                <label>封面</label>
                <input name="cover" type="text" value="__cover__">
            </div>
            <div class="row lyric">
                <label>歌词</label>
                <textarea name="lyrics">__lyrics__</textarea>
            </div>
            <div class="row">
                <button type="submit">保存</button>
            </div>
        </form>
        <form class="addPlaylist">
            加入歌单：
            <select name="playList" id="selectList">
               <option>--选择歌单--</option> 
            </select>
            <a href="./addPlaylist.html">创建歌单</a>
        </form>
        `,
        render(data = {}, playlists) {
            let placeholders = ['name', 'singer', 'url', 'id', 'cover', 'lyrics']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            
            playlists.lists.map((list) => {
                let $option = $('<option></option>').text(list.name).attr('value', list.id)
                $(this.el).find('select').append($option)
            })
            
            
            if(playlists.list.id){
                let options = $(this.el).find('#selectList option')
                
                for(let i=0; i<options.length;i++){
                   let selectedOption = options[i]
                   if($(selectedOption).val() === playlists.list.id){
                    selectedOption.selected = 'selected'
                    break
                   }
                }
            }
            



        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', id: '', cover: '', lyrics: ''
        },
        playlists: {
            lists: [{ name: '', uploader: '', id: '', cover: '', summary: '' }],
            list:{}
        },
        create(data) {


            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);
            
            song.set('dependent', this.playlists.list);

            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                this.data = { id, ...attributes }
            }, (error) => {
                console.error(error);
            });
        },
        findPlaylist() {
            var query = new AV.Query('Playlist')
            return query.find().then((lists) => {
                this.playlists.lists = lists.map((list) => {
                    return { id: list.id, ...list.attributes }
                })
                return lists
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.model.findPlaylist().then(() => {
                this.view.render(this.model.data, this.model.playlists);
                this.onSelected()
                
            })
            this.bindEvents()

            window.eventHub.on('upload', (data) => {
                this.model.data = data
                this.view.render(this.model.data, this.model.playlists);
            })
            window.eventHub.on('select', (data) => {
                this.model.data = data.data
                this.model.playlists.list = data.playlist
                this.view.render(this.model.data,this.model.playlists);
                this.onSelected()
            })
            window.eventHub.on('new', () => {
                if (this.model.data.id) {
                    this.model.data = {}
                    this.model.playlists.list = {}
                    this.view.render(this.model.data, this.model.playlists);
                }

            })

        },
        create() {
            let needs = ['name', 'singer', 'url', 'cover', 'lyrics']
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            
            this.model.create(data).then(() => {
                this.model.playlists.list = {}
                this.view.render({}, this.model.playlists)
                window.eventHub.emit('create', this.model.data)
            })


        },
        updata() {
            let needs = ['name', 'singer', 'url', 'cover', 'lyrics']
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            
           
            
            var song = AV.Object.createWithoutData('Song', this.model.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyrics', data.lyrics)
            //let song = AV.Object.createWithoutData('Song', this.model.data.id)
            song.set('dependent', this.model.playlists.list)
            //song.save()
            

            data.id = this.model.data.id
            song.save().then(() => {
                window.eventHub.emit('updata', JSON.parse(JSON.stringify(data)))
            })

        },
        bindEvents() {
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                if (this.model.data.id) {
                    this.updata()
                } else {
                    this.create()
                }
            })




        },
        onSelected() {
            $(document).ready(() => {
                $('#selectList').change(() => {
                    let selectedId = $('#selectList option:selected').val()
                    let Lists = this.model.playlists.lists
                    
                    Lists.map((list) => {
                        if (list.id === selectedId) {
                            this.model.playlists.list = list
                            
                            return list
                        }
                    })
                }).bind(this)
            })
        }
    }
    controller.init(view, model);
}