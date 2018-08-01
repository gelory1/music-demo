{
    let view = {
        el: 'main .page3',
        template: `
            <li>
                <a href="./song.html?id={{id}}">
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
        render(data) {



            let songs = data.songs
            songs.map((song) => {
                let html = this.template.replace('{{name}}', song.name)
                    .replace('{{singer}}', song.singer)
                    .replace('{{id}}', song.id)
                $(this.el).find('ul').append(html)
            })
        }
    }
    let model = {
        data: {
            songs: []
        },
        find(name) {
            let queryname = new AV.Query('Song')
            queryname.contains('name', name)
            let querysinger = new AV.Query('Song')
            
            querysinger.contains('singer', name)
            let query = AV.Query.or(queryname,querysinger)
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.bindEvents()
        },
        bindEvents() {
            let input = $(this.view.el).find('input')[0]
            let hotSearh = $(this.view.el).find('.hotSearch')

            input.onchange = (e) => {
                e.preventDefault
                $(hotSearh).addClass('hidden')
                let ul = $(this.view.el).find('ul')[0]
                $(ul).empty()
                let name = input.value
                if (name !== '') {
                    this.model.find(name).then(() => {
                        this.view.render(this.model.data)
                    })
                } else {
                    $(hotSearh).removeClass('hidden')

                }
            }
            let hotSearch = $(this.view.el).find('.hotSearch')
            hotSearch.on('click', 'span', (e) => {
                $(hotSearh).addClass('hidden')
                input.value = e.currentTarget.innerText
                this.model.find(e.currentTarget.innerText).then(() => {
                    this.view.render(this.model.data)
                })
            })
        }
    }
    controller.init(view, model)
}