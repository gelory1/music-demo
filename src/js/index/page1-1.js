{
    let view = {
        el: '.page1 .page1-1',
        template: `
            <li>
                <a href="./playlist.html?id={{id}}">
                    <div class="songCover">
                        <img src="{{cover}}">
                        <div class="songTimes">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-headphone_f"></use>
                            </svg>
                            <span>78万</span>
                        </div>
                        <div class="songIntroduce">
                            {{name}}
                        </div>
                    </div>
                </a>
            </li>
        `,
        render(data){
            let playlists = data.playlists
            playlists.map((playlist)=>{
                let html = this.template.replace('{{id}}',playlist.id)
                .replace('{{name}}',playlist.name)
                .replace('{{cover}}',playlist.cover)
                $(this.el).find('ul').append(html)
            })
        }
    }
    let model = {
        data:{
            playlists: []
        },
        find(){
            var query = new AV.Query('Playlist')
            return query.limit(6).descending('createdAt').find().then((playlists)=>{
                this.data.playlists = playlists.map((playlist)=>{
                    return {id:playlist.id,...playlist.attributes}
                })
                return playlists
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
        },

    }
    controller.init(view,model)
}