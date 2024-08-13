import React, { useState, useEffect } from 'react'
import './Recommended.css'
import thumbnail1 from '../../assets/thumbnail1.png'
import thumbnail2 from '../../assets/thumbnail2.png'
import thumbnail3 from '../../assets/thumbnail3.png'
import thumbnail4 from '../../assets/thumbnail4.png'
import thumbnail5 from '../../assets/thumbnail5.png'
import thumbnail6 from '../../assets/thumbnail6.png'
import thumbnail7 from '../../assets/thumbnail7.png'
import thumbnail8 from '../../assets/thumbnail8.png'
import { API_KEY } from '../../Data'
import { value_converter } from '../../Data'
import { Link } from 'react-router-dom'

export default function Recommended({ categoryId }) {
    const [apiData, setApiData] = useState([]);
  
    const fetchData = async () => {
      const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
      try {
        const response = await fetch(relatedVideo_url);
        const data = await response.json();
        setApiData(data.items || []); // Ensure apiData is an empty array if no items are returned
      } catch (error) {
        console.error("Failed to fetch recommended videos data:", error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [categoryId]);
  
    return (
      <div className='recommended'>
        {apiData.map((item, index) => (
          <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className='side-video-list'>
            <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
            <div className='vid-info'>
              <h4>{item.snippet.title}</h4>
              <p>{item.snippet.channelTitle}</p>
              <p>{value_converter(item.statistics.viewCount)} Views</p>
            </div>
          </Link>
        ))}
      </div>
    );
  }
