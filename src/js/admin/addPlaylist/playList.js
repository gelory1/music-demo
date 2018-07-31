{
    let view = {
        el: '.page aside .playList',
        template:  `
            <ul>
            </ul>
        `,
        render(data){
            $(this.el).html(this.template)
            let {lists,selectedId} = data
            let liList = lists.map((list)=>{
                let $li = $('<li></li>').text(list.name).attr('data-list-id',list.id)
                if(list.id === selectedId){
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
            lists:[],
            selectedId: undefined
        },
        find(){
            var query = new AV.Query('Playlist')
            return query.find().then((lists)=>{
                this.data.lists = lists.map((list)=>{
                    return {id:list.id,...list.attributes}
                })
                return lists
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
            this.getAllLists()
        },
        getAllLists(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let listId = e.currentTarget.getAttribute('data-list-id')
                this.model.data.selectedId = listId
                this.view.render(this.model.data)
                let data
                let lists = this.model.data.lists
                for(let i=0;i<lists.length;i++){
                    if(lists[i].id === listId){
                        data = lists[i]
                        break
                    }
                }
                window.eventHub.emit('selectPlaylist',JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventHub(){
            window.eventHub.on('createPlaylist',(data)=>{
                this.model.data.lists.push(data)
                this.view.clearActive()
                this.view.render(this.model.data)
            })
            window.eventHub.on('newPlaylist',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('updataPlaylist',(data)=>{
                let lists = this.model.data.lists
                for(let i=0;i<lists.length;i++){
                    if(lists[i].id === data.id){
                        lists[i] = data
                        
                        break
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}