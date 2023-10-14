import React, { Fragment } from 'react'

function Landing() {
    return (
        <Fragment>
            <div>
                <h1>Welcome to LosSorcios!</h1>
                This application allows you to upload images, rate them based on the category 
                that our autmatic classifier decides, and to see the top ranked images!
                <h2>A quick overview:</h2>
                <ul>
                    <li><b>Upload images</b>: upload any image you wish, but keep in mind that the explicit content detector is supervising ...</li>
                    <li><b>Display top images</b>: take a look at the most-liked images of this website!</li>
                    <li><b>Display buckets & Rate</b>: filter images by their content, and rate them!</li>
                </ul>
            </div>
        </Fragment>
        
    )
}

export default Landing