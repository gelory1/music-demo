{
    let view = {
        el: 'nav',
        active(li){
            $(li).addClass('active').siblings('.active').removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let $li = e.currentTarget
                this.view.active($li)
                let datapage = $($li).attr('page-name')
                window.eventHub.emit('tab',datapage)
            })
        }
    }
    controller.init(view,model)
}