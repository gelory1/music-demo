{
    let view = {
        el: '.page aside .newSong',
        template: `
            <span>新建歌曲</span>
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
            window.eventHub.on('upload',()=>{
                this.active()
            })
            window.eventHub.on('select',()=>{
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
                window.eventHub.emit('new')
            })
        }
    }
    controller.init(view,model);
}