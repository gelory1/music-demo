{
    let view = {
        el: '.page1',
        active(selector){
            $(selector).addClass('active').siblings('.active').removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEventHub()
            this.loadPage()
        },
        loadPage(){
            let script1 = document.createElement('script')
            script1.src = './js/index/page1-1.js'
            document.body.appendChild(script1)

            let script2 = document.createElement('script')
            script2.src = './js/index/page1-2.js'
            document.body.appendChild(script2)
        },
        bindEventHub(){
            window.eventHub.on('tab',(data)=>{
                this.view.active('.' + data)
            })
        }
    }
    controller.init(view,model)
}