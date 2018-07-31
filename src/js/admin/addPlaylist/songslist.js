{
    let view = {
        el: '.page main section.allSongs',
        template: `
        <h3>表单歌曲</h3>
        <ul>
        </ul>
        <a href="./admin.html">增加歌曲</a>
        `,
        render(data) {
            $(this.el).html(this.template)
            var query = new AV.Query('Song');
            query.equalTo('dependent', data).find().then((songs) => {
                songs.map((song) => {
                    console.log(song)
                    let $li = $(`<li>${song.attributes.name}</li>`)
                    console.log($li)
                    $(this.el).find('ul').append($li)
                })
            })
        }
    }
    let model = {
        data: {}
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.getAllSongs()

        },
        getAllSongs() {

            window.eventHub.on('selectPlaylist', (data) => {
                this.view.render(data)
            })


        }
    }
    controller.init(view, model)
}