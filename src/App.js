import React, { Component } from 'react';
import './App.css';
import InfinitScroll from './InfinitScroll'
import axios from 'axios'

// https://cassetterocks.github.io/react-infinite-scroller/demo/
//https://github.com/CassetteRocks/react-infinite-scroller/blob/master/src/InfiniteScroll.js
let api = {
  baseUrl: 'https://api.soundcloud.com',
  client_id: 'caf73ef1e709f839664ab82bef40fa96'
};


class App extends Component {
  constructor(props){
    super(props);

    this.scrollParent = React.createRef();
    this.state = {
      datas : [],
      nextHref : null
    }
    this.loadItem(0);
  }
  // 1. 처음 데이터 가져오기 
  loadItem =(page)=>{
    var url = api.baseUrl + '/users/8665091/favorites';
    if(this.state.nextHref) url = this.state.nextHref;
    axios.get(url, {
      params : {
        client_id: api.client_id,
        linked_partitioning: page,
        page_size: 10
      }
    }, {
        cache: true
    }).then((resp)=>{
      console.log(resp);
      this.setState({
        nextHref : resp.data.next_href,
        datas : this.state.datas.concat(resp.data.collection)
      })
    })
  }
//()=>{console.log(this);return this.scrollParent}
  render() {
    const {datas} = this.state;
    var items = [];
    items = datas.map(v=>(<div key={v.id}><img src={v.artwork_url} width="100" height="100" ></img><span>{v.title}</span></div>))

    return (
      <div className="App" ref={ref => this.scrollParent = ref}>
        <InfinitScroll 
        pageStart={1}
        loadItem={this.loadItem}
        getParent={()=>this.scrollParent}>
          {items}
        </InfinitScroll>
      </div>
    );
  }
}

export default App;
