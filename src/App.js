import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {

  const [blogs, setBlogs]=useState([]);
  const [pageNum, setPageNum]=useState(1);
  const [loadingBlogs, setLoadingBlogs]=useState(true);
  const [totalPages, setTotalPages]=useState(20); //value of total pages

  //create an observer ref with IntersectionObserver
  const observer = useRef(
    new IntersectionObserver(
      entries => {
        //select first entry that is intersecting with the observer
        const first = entries[0];
        if (first.isIntersecting) {
          //when isIntersecting, call function to load more blogs
          loadMoreBlogs();
        }
      },
      { threshold: 1 }
    )
  );

  //state for checking if it is end of current page entries
  const [currentPageEnd, setCurrentPageEnd] = useState(null);

  //function to call blogs api and append to current blog list
  const fetchBlogs=async(pageNum)=>{
    setLoadingBlogs(true);
    const result=await fetch(`https://api.theinnerhour.com/v1/blogposts?page=${pageNum}&limit=9`);
    const data = await result.json();
    setBlogs(prevBlogs=>[...prevBlogs,...data.list]);
    setTotalPages(data.meta.total);
    setLoadingBlogs(false);
  }

  //function to increment the current page number
  const loadMoreBlogs=()=>{
    setPageNum(currentPage=>currentPage+1);
  }

  //call fetchBlogs function when current page number state is updated
  useEffect(()=>{
    //checks if current page number is greater than total pages
    if(pageNum>totalPages) return;
    //else calls api for next page
    fetchBlogs(pageNum);
  },[pageNum,totalPages]);

  //observe and unobserve according to current page end
  useEffect(() => {
    const currentObserver = observer.current;
    if (currentPageEnd) {
      currentObserver.observe(currentPageEnd);
    }
    return () => {
      if (currentPageEnd) {
        currentObserver.unobserve(currentPageEnd);
      }
    };
  }, [currentPageEnd]);

  return (
    <div className="App">
      <div className="page-start-div"></div>
      <div className='blog-list'>
        {
          blogs &&
          blogs.map((blog, key)=>{
            return (<div key={key} className='blog-card'>
              <div className='blog-cover'><img src={blog.cover} alt="blog cover"/></div>
              <div className='blog-title'>{blog.title}</div>
            </div>)
          })
        }
      </div>
      {
          loadingBlogs &&
          <div>
            loading....
          </div>
        }
      <div className="loading-div" ref={setCurrentPageEnd}></div>
    </div>
  );
}

export default App;