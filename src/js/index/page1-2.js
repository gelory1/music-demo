{
    let view = {
        el: '.page1 .page1-2',
        template: 
        `
            <li>
                <a href="./song.html?id={{id}}">
                    <div class="songWrapper">
                        <div class="songWrapper-info">
                            <div class="songName">{{name}}</div>
                            <div class="songSinger">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-sq"></use>
                                </svg>
                                <span class="singer">{{singer}}</span>
                            </div>
                        </div>
                        <div class="playLogo">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-play"></use>
                            </svg>
                        </div>
                    </div>
                </a>
            </li>
        `,
        render(data){
            let songs = data.songs
            songs.map((song)=>{
                let html = this.template.replace('{{name}}',song.name)
                .replace('{{singer}}',song.singer)
                .replace('{{id}}',song.id)
                $(this.el).find('ul').append(html)
            })
            
        }
    }
    let model = {
        data: {
            songs: []
        },
        find(){
            var query = new AV.Query('Song')
            return query.limit(10).descending('createdAt').find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}