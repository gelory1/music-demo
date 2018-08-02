{
    let view = {
        el: 'main .page2',
        template: `
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
        render(data){
            let songs = data.songs
            let number = 1
            songs.map((song)=>{
                let html = this.template.replace('{{name}}',song.name)
                .replace('{{singer}}',song.singer)
                .replace('{{id}}',song.id).replace('{{number}}',number)
                $(this.el).find('ol').append(html)
                number +=1
                
                if(number > 4){
                    let songNumber = $(this.el).find('.songNumber')[number-2]
                    $(songNumber).addClass('active')
                }else{
                    let songNumber = $(this.el).find('.songNumber')[number-2]
                    $(songNumber).removeClass('active')
                    
                }
            })
        }
    }
    let model = {
        data: {
            songs: []
        },
        find(){
            var query = new AV.Query('Song')
            return query.limit(10).find().then((songs)=>{
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