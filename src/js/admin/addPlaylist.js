{
    let view = {
        el: '.page',
        template:`
        <aside>
            <div class="logo"></div>
            <div class="newPlaylist">
                <span>新建歌单</span>
                <span>+</span>
            </div>
            <div class="playList">
                
            </div>
        </aside>
        <main>
            <div class="uploadAndSave">
                <section class="uploadSong">
                </section>
                <section class="saveSong">
                    <form>
                        <div class="row">
                            <label>歌单</label>
                            <input name="name" type="text" value="__name__">
                        </div>
                        <div class="row">
                            <label>描述</label>
                            <input name="singer" type="text" value="__descripton__">
                        </div>
                        <div class="row">
                            <label>封面</label>
                            <input name="cover" type="text" value="__cover__">
                        </div>
                        <div class="row">
                            <button type="submit">保存</button>
                        </div>
                        <div class="songsList">
                            <label>歌曲列表</label>
                            <ul>

                            </ul>
                        </div>
                    </form>
                </section>
            </div>
        </main>
        `,
        render(data = {}){
            let placeholders = ['name', 'descripton', 'cover','id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            
        }
    }
    let model = {
        data: {
            name: '', descripton: '', id: '', cover: ''
        },
        createList(data){
            var Playlist = AV.Object.extend('Playlist');
            var playList = new Playlist();
            playList.set('name', data.name);
            playList.set('descripton', data.descripton);
            playList.set('cover', data.cover);
            return playList.save().then((newList) => {
                let { id, attributes } = newList
                this.data = { id, ...attributes }
            }, (error) => {
                console.error(error);
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents()
            this.view.render(this.model.data)
            let newlist = $(this.view.el).find('.newPlaylist')[0]
            this.active(newlist)
            window.eventHub.on('selectPlaylist', (data) => {
               let newlist = $(this.view.el).find('.newPlaylist')[0]
                this.model.data = data
                this.view.render(this.model.data)
                this.deactive(newlist)

            })
        },
        active(element){
            $(element).addClass('active')
        },
        deactive(element){
            $(element).removeClass('active')
        },
        bindEvents(){
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
               
                if (this.model.data.id) {
                    this.updata()
                } else {
                    this.create()
                }
            })
            $(this.view.el).on('click','.newPlaylist',()=>{
                window.eventHub.emit('newPlaylist')
                this.view.render({})
                let newlist = $(this.view.el).find('.newPlaylist')[0]
                this.active(newlist)

            })
        },
        create(){
            let needs = ['name', 'descripton', 'cover']
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            this.model.createList(data).then(() => {
                this.view.render({})
                window.eventHub.emit('createPlaylist', this.model.data)
            })
        },
        updata(){
            let needs = ['name', 'descripton',  'cover']
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            var song = AV.Object.createWithoutData('Playlist',this.model.data.id)
            song.set('name',data.name)
            song.set('descripton',data.descripton)
            song.set('cover',data.cover)
            data.id = this.model.data.id
            song.save().then(()=>{
                window.eventHub.emit('updataPlaylist',JSON.parse(JSON.stringify(data)))
            })
        }
    }
    controller.init(view,model)
}