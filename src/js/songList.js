{
    let view = {
        el: '.page aside .songList',
        template:  `
            <ul>
            </ul>
        `,
        render(data){
            $(this.el).html(this.template)
            let {songs} = data
            let liList = songs.map((song)=>{
                return $('<li></li>').text(song.name)
            })
            $(this.el).find('ul').empty()
            liList.map((li)=>{
                $(this.el).find('ul').append(li)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs:[]
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            window.eventHub.on('upload',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}