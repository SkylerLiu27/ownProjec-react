import './NewsPanel.css';
import NewsCard from '../NewsCard/NewsCard';

import React from 'react';
import _ from 'lodash';
import Auth from '../Auth/Auth';

class NewsPanel extends React.Component{

    constructor(props){
        super(props);
        this.state = {news: null, pageNum: 1, loadedAll: false};
    }
    // add event handler here
    componentDidMount(){
        this.loadMoreNews();
        this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll(){
        let scrollY = window.scrollY || window.pageYOffset ||
        document.documentElement.scrollTop;

        if((window.innerHeight + scrollY) >= document.body.offsetHeight){
            console.log('handleScroll');
            this.loadMoreNews();
        }
    }

    renderNews(){
        let new_card_list = this.state.news.map(news_item => {
            return (
                <a className='list-group-item' href='#'>
                    <NewsCard news={news_item}></NewsCard>
                </a>
            );
        });
        return (
            <div className='container-fluid'>
                <div className='list-group'>
                    {new_card_list}
                </div>
            </div>
        );
    }

    loadMoreNews(){
        if(this.state.loadedAll){
            return;
        }
        console.log("loading more news")

        const news_url = 'http://' + window.location.hostname + ':3000' +
        '/news/userId/' + Auth.getEmail() + '/pageNum/' + this.state.pageNum;
        const headers = {
            'Authorization': 'bearer ' + Auth.getToken()
        };
        const init = {
            method: 'GET', 
            headers: headers
        };
        const request = new Request(encodeURI(news_url), init);
        console.log('load more news');

        // send HTTP request to server
        fetch(request)
            .then(res => res.json())
            .then(fetched_news_list => {
                if (!fetched_news_list || fetched_news_list.length == 0) {
                this.setState({loadedAll:true});
                } else {
                this.setState({
                    news: this.state.news ? this.state.news.concat(fetched_news_list) : fetched_news_list,
                    pageNum: this.state.pageNum + 1,
                });
                }
            });
        }



        
    render(){
        if(this.state.news){
            return(
                <div>
                    {this.renderNews()}
                </div>
            );
        }else{
            return (
                <div id='msg-app-loading'>
                    Loading More.........
                </div>
            );
        }
    }
}
export default NewsPanel;