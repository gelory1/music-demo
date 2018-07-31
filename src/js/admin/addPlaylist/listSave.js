{
    let view = {
        el: '.page main section.saveList',
        template: `
        <form>
            <div class="row">
                <label>歌单</label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label>上传</label>
                <input name="uploader" type="text" value="__uploader__">
            </div>
            <div class="row">
                <label>封面</label>
                <input name="cover" type="text" value="__cover__">
            </div>
            <div class="row summary">
                <label>简介</label>
                <textarea name="summary">__summary__</textarea>
            </div>
            <div class="row">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'uploader', 'id','cover','summary']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {
        data: {
            name: '', uploader: '', id: '', cover: '', summary: ''
        },
        create(data) {
            var Playlist = AV.Object.extend('Playlist');
            var playlist = new Playlist();
            playlist.set('name', data.name);
            playlist.set('uploader', data.uploader);
            playlist.set('cover', data.cover);
            playlist.set('summary', data.summary);
            return playlist.save().then((newList) => {
                let { id, attributes } = newList
                this.data = { id, ...attributes }
            }, (error) => {
                console.error(error);
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents();
            window.eventHub.on('selectPlaylist', (data) => {
                this.model.data = data
                this.view.render(this.model.data)

            })
            window.eventHub.on('newPlaylist', () => {
                if (this.model.data.id) {
                    this.model.data = {}
                    this.view.render(this.model.data)
                }

            })
        },
        create() {
            let needs = ['name', 'uploader', 'cover', 'summary']
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            this.model.create(data).then(() => {
                this.view.render({})
                window.eventHub.emit('createPlaylist', this.model.data)
            })
        },
        updata() {
            let needs = ['name', 'uploader', 'cover', 'summary']
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            var playlist = AV.Object.createWithoutData('Playlist',this.model.data.id)
            playlist.set('name',data.name)
            playlist.set('uploader',data.uploader)
            playlist.set('cover',data.cover)
            playlist.set('summary',data.summary)
            data.id = this.model.data.id
            playlist.save().then(()=>{
                window.eventHub.emit('updataPlaylist',JSON.parse(JSON.stringify(data)))
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
        }
    }
    controller.init(view, model);
}