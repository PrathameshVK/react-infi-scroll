import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [blogs, setBlogs]=useState([]);
  const [pageNum, setPageNum]=useState(2);
  const [loading, setLoading]=useState(false);
  const pageEnd=useRef();

  const fetchBlogs=async(pageNum)=>{
    const result=await fetch(`https://api.theinnerhour.com/v1/blogposts?page=${pageNum}`)
    const data = await result.json();
    setBlogs(prevBlogs=>[...prevBlogs,...data.list]);
    setLoading(true);
  }

  const loadMoreBlogs=()=>{
    setPageNum(currentPage=>currentPage+1);
  }


  useEffect(()=>{
    if(loading){
      //create new observer
      const observer=new IntersectionObserver(entries=>{
        //check if entries are intersecting with the observer
        if(entries[0].isIntersecting){
          console.log("calling")
          loadMoreBlogs();
        }
      },{threshold:1});
      observer.observe(pageEnd.current);
    }
  },[loading])

  useEffect(()=>{
    fetchBlogs(pageNum);
  },[pageNum]);

  return (
    <div className="App">
      <h1>blogs here</h1>
      <div className='blog-list'>
        {
          blogs &&
          blogs.map((blog, key)=>{
            return (<div key={key} className='blog-card'>
              <div className='blog-cover'><img src={blog.cover}/></div>
              <div className='blog-title'>{blog.title}</div>
              <div className='blog-time'>{blog.created_at}</div>
            </div>)
          })
        }
      </div>
      {
        loading &&
        <div ref={pageEnd}>loading</div>
      }
    </div>
  );
}

export default App;
