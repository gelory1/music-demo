{
    let view = {
        el: '.loadingWrapper',
        active(){
            $(this.el).addClass('active')
        },
        deactive(){
            $(this.el).removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('beforeLoading',()=>{
                this.view.active()
            })
            window.eventHub.on('afterLoading',()=>{
                this.view.deactive()
            })
        }
    }
    controller.init(view,model)
}