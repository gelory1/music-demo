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
        `,
        render(data = {}) {
            let placeholders = ['name', 'singer', 'url', 'id','cover','lyrics']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', id: '', cover: '', lyrics: ''
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                this.data = { id, ...attributes }
            }, (error) => {
                console.error(error);
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents();
            window.eventHub.on('upload', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)

            })
            window.eventHub.on('new', () => {
                if (this.model.data.id) {
                    this.model.data = {}
                    this.view.render(this.model.data)
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
                this.view.render({})
                window.eventHub.emit('create', this.model.data)
            })
        },
        updata() {
            let needs = ['name', 'singer', 'url', 'cover', 'lyrics']
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            var song = AV.Object.createWithoutData('Song',this.model.data.id)
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('url',data.url)
            song.set('cover',data.cover)
            song.set('lyrics',data.lyrics)
            data.id = this.model.data.id
            song.save().then(()=>{
                window.eventHub.emit('updata',JSON.parse(JSON.stringify(data)))
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