
import React from 'react';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./Carousel.css";
import BestList from './BestList';
import 'animate.css'; //이거 없으면 animate 안됨.

const HomePage = () => {

  return (
    <div className='sql'>

        <img
          sizes='100vw'
          className="d-block w-100"
          src="/image/image17.png"
        />

      <div className='img5'>
        <img
          size='10px'
          className="d-block w-100"
          src="/image/image16.jpg"
        />
      </div>

      <div className='animate__animated animate__backInLeft'>
        <img
          size='10px'
          className="d-block w-100"
          src="/image/image19.jpg"
        />
      </div>

      <h3 className='animate__animated animate__swing animate__repeat-2'>인기상품</h3>
      <hr />
      <BestList />
    </div>





  )
}

export default HomePage




