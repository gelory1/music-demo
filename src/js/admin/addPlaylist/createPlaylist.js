{
    let view = {
        el: '.page aside .newPlaylist',
        template: `
            <span>新建歌单</span>
            <span>+</span>
        `,
        render(){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.active()
            window.eventHub.on('selectPlaylist',()=>{
                this.deactive()
            })
            this.bindEvents()
        },
        active(){
            $(this.view.el).addClass('active')
        },
        deactive(){
            $(this.view.el).removeClass('active')
        },
        bindEvents(){
            $(this.view.el).on('click',()=>{
                this.active()
                window.eventHub.emit('newPlaylist')
            })
        }
    }
    controller.init(view,model);
}