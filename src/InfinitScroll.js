import React,{Component} from 'react'

/**
 * 무한 스크롤 Component
 */
export default class InfiniteScoll extends Component {
    static defaultProps = {
        loadItem : null
    }
    constructor(props){
        super(props)
        //무한 스크롤 속성 
        this._props = {
            loadMore : true,
            initLoad : true,
            page:0,
            parentNode : null,
            scrollNode : React.createRef()
        }
        this.timer = null;
    }
    // DOM 에 관련된 작업: 스크롤 설정, 크기 읽어오기 등
    componentDidMount(){
        this.page = this.props.pageStart;
        console.log("componentDidMount",this.props.getParent())
        this.attachScrollListener();
    }

    componentWillReceiveProps(){
        console.log("componentWillReceiveProps",this.props.getParent())
       //this.attachScrollListener();
    }
    /*
        1.render()
        2.getSnapshotBeforeUpdate()
        3.실제 DOM 에 변화 발생
        4.componentDidUpdate
    */
    //시점 4
    componentWillUpdate(prevProps, prevState, snapshot) {
        console.log("componentWillUpdate",this.props,prevProps,snapshot)
        this.attachScrollListener();

    }

    componentDidUpdate(){
        console.log("????")
    }

    //컴포넌트 삭제 시 
    componentWillUnmount(){
        console.log("componentWillUnmount")

    }

    getParentNode=()=>{
        let parent = this.props.getParent && this.props.getParent();
        if(parent){
            this._props.parentNode = parent;
        } 
        return parent;
    }

    /**
     * scroll 이벤트 등록
     */
    attachScrollListener=()=>{
        let parent = this.getParentNode();
        if(!parent || !this._props.loadMore) return;
        
        // 이벤트 등록 
        this.dettachScrollListener();
        //  parent.event
        parent.addEventListener('mousewheel',this.mousewheelListener)
        parent.addEventListener('scroll',this.scrollListener)
        if(this._props.initLoad){
            this.props.loadItem(this._props.page);
            this._props.initLoad = false;
        }
    }

    /**
     * scroll 이벤트 해제
     */
    dettachScrollListener=()=>{
        let parent = this.getParentNode();
        if(!parent || !this._props.loadMore) return;
        
        parent.removeEventListener('mousewheel',this.mousewheelListener)
        parent.removeEventListener('scroll',this.scrollListener)
    }

    /**
     * 마우스휠 이벤트
     */
    mousewheelListener=(e)=>{
        if(e.deltaY === 1) e.preventDefault();
    }

    /**
     * 스크롤 이벤트
     */
    scrollListener=(e)=>{   
        const {scrollNode,parentNode} = this._props   
        var that  = this;
        this.setTimeout(function(){
            if(scrollNode.scrollHeight - parentNode.scrollTop - parentNode.clientHeight <= 0 ){
                that.props.loadItem(that._props.page++);
                that = null;
            }
        
        })
        e.preventDefault();
    }

    setTimeout=(fn)=>{
        if(this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(fn,100);
    }


    render(){
            /**/
        const {hasMore} = this.props;
       return(<div ref={(ref)=>this._props.scrollNode = ref}>{this.props.children}</div>)

    }
};
