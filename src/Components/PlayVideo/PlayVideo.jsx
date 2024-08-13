import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../Data'
import moment from 'moment'
import { useParams } from 'react-router-dom'

export default function PlayVideo() {

    const {videoId} = useParams();
    
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
  
    const fetchVideoData = async () => {
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      try {
        const response = await fetch(videoDetails_url);
        const data = await response.json();
        setApiData(data.items[0]);
      } catch (error) {
        console.error("Failed to fetch video data:", error);
      }
    };
  
    const fetchChannelData = async () => {
      if (!apiData) return;
      const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      try {
        const response = await fetch(channelData_url);
        const data = await response.json();
        setChannelData(data.items[0]);
      } catch (error) {
        console.error("Failed to fetch channel data:", error);
      }
    };
  
    const fetchCommentData = async () => {
      const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
      try {
        const response = await fetch(comment_url);
        const data = await response.json();
        setCommentData(data.items || []); // Fallback to an empty array if no comments
      } catch (error) {
        console.error("Failed to fetch comment data:", error);
      }
    };
  
    useEffect(() => {
      fetchVideoData();
    }, [videoId]);
  
    useEffect(() => {
      if (apiData) {
        fetchChannelData();
        fetchCommentData();
      }
    }, [apiData]);
  
    return (
      <div className='play-video'>
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen>
        </iframe>
        <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
        <div className='play-video-info'>
          <p>{apiData ? value_converter(apiData.statistics.viewCount) : "16k"} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : "2 days ago"}</p>
          <div>
            <span><img src={like} alt="like" />{apiData ? value_converter(apiData.statistics.likeCount) : 155}</span>
            <span><img src={dislike} alt="dislike" /></span>
            <span><img src={share} alt="share" />Share</span>
            <span><img src={save} alt="save" />Save</span>
          </div>
        </div>
        <hr />
        <div className="publisher">
          <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="publisher" />
          <div>
            <p>{apiData ? apiData.snippet.channelTitle : "channel name"}</p>
            <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscribers</span>
          </div>
          <button>Subscribe</button>
        </div>
        <div className='vid-description'>
          <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description here"}</p>
          <hr />
          <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>
          {commentData.length > 0 ? (
            commentData.map((item, index) => (
              <div key={index} className='comment'>
                <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="comment author" />
                <div>
                  <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
                  <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                  <div className='comment-action'>
                    <img src={like} alt="like" />
                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                    <img src={dislike} alt="dislike" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No comments available</p>
          )}
        </div>
      </div>
    );
  }