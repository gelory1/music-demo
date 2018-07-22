{
    let view = {
        el: '.page aside .songList',
        template:  `
            <ul>
            </ul>
        `,
        render(data){
            $(this.el).html(this.template)
            let {songs,selectedId} = data
            let liList = songs.map((song)=>{
                let $li = $('<li></li>').text(song.name).attr('data-song-id',song.id)
                if(song.id === selectedId){
                    $li.addClass('active')
                }
                return $li
            })
            
            $(this.el).find('ul').empty()
            liList.map((li)=>{
                $(this.el).find('ul').append(li)
            })
        },
        activeItem(li){
            $(li).addClass('active').siblings('.active').removeClass('active')
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs:[],
            selectedId: undefined
        },
        find(){
            var query = new AV.Query('Song')
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.bindEventHub()
            this.bindEvents()
            this.getAllSongs()
        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectedId = songId
                this.view.render(this.model.data)
                let data
                let songs = this.model.data.songs
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                        break
                    }
                }
                window.eventHub.emit('select',JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventHub(){
            window.eventHub.on('upload',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('updata',(data)=>{
                let songs = this.model.data.songs
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === data.id){
                        songs[i] = data
                        
                        break
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}