import './NewsCard.css';
import React from 'react';
import Auth from '../Auth/Auth';

class NewsCard extends React.Component {
    
    redirectToUrl(url, event){
      event.preventDefault();
      // send click log to node.js
      this.sendClickLog();
      window.open(url, '_blank');
    }

    sendClickLog(){
      const url = `http://localhost:3000/news/userId/${Auth.getEmail()}/newsId/${this.props.news.digest}` 
      const headers = {
        'Authorization': 'bearer ' + Auth.getToken()
      };
      const init = {
        method: 'POST', 
        headers: headers
      };
      const request = new Request(encodeURI(url), init);
      fetch(request);
    }

    render(){
        return (
            <div className="news-container" onClick={(event) => this.redirectToUrl(this.props.news.url, event)}>
            <div className='row'>
              <div className='col s4 fill'>
                <img src={this.props.news.urlToImage} alt='news'/>
              </div>
              <div className="col s8">
                <div className="news-intro-col">
                  <div className="news-intro-panel">
                    <h4>{this.props.news.title}</h4>
                    <div className="news-description">
                      <p>{this.props.news.description}</p>
                      <div>
                        {this.props.news.source != null && <div className='chip light-blue news-chip'>{this.props.news.source}</div>}
                        {this.props.news.reason != null && <div className='chip light-green news-chip'>{this.props.news.reason}</div>}
                        {this.props.news.time != null && <div className='chip amber news-chip'>{this.props.news.time}</div>}
                        {this.props.news.class != null && <div className='chip amber news-chip'>{this.props.news.class}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }

}
export default NewsCard;