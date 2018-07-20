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
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'singer', 'url','id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', id: ''
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then( (newSong)=>{
                let {id,attributes} = newSong
                this.data = {id,...attributes}
            }, (error)=>{
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
                this.view.render(data)
            })
        },
        bindEvents() {
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = ['name', 'singer', 'url']
                let data = {}
                needs.map((string) => {
                    data[string] = $(this.view.el).find(`[name="${string}"]`).val()
                })
                this.model.create(data).then(()=>{
                    this.view.render({})
                    window.eventHub.emit('create',this.model.data)
                })
            })
        }
    }
    controller.init(view, model);
}