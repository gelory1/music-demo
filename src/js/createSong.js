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
        },
        active(){
            $(this.view.el).addClass('active')
        }
    }
    controller.init(view,model);
}