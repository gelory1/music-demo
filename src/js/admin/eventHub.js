window.eventHub = {
    events: {},
    emit(eventName,data){
        for(let key in this.events){
            if(key === eventName){
                let fnlist = this.events[eventName]
                fnlist.map((fn)=>{
                    fn.call(undefined,data)
                })
            }
        }
    },
    on(eventName,fn){
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
}