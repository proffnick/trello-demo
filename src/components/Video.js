import React from 'react';
export const Video = () => {

    return(
      <div className='container col-11 col-lg-9 mx-auto my-4'>
        <h3 className='text-muted my-3'>How it works</h3>
      <iframe className='rounded-3 shadow-lg' width="100%" height="515" src="https://www.youtube.com/embed/DEGW9K5JgMI" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

      </div>
    );
}
