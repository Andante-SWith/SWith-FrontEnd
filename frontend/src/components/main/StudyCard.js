import React from "react";
import './StudyCard.css'
import styled from "styled-components";

function StudyCard({title,imgUrl,body}) {
    return(
        <>
            <button className="card-container">
                <div className="image-container">
                    <img src ={imgUrl} alt='기본스터디이미지'/>

                </div>
                <div className="card-content">
                    <div className="card-title">
                        <h3>{title}</h3>
                    </div>
                    <div className="card-body">
                        <div className = "hashtagWrap">
                            {body.map((x)=>{
                                return (
                                <>{'#'+x.hashtag+' '}</>
                            )})}
                        </div>
                    </div>

                </div>

            </button>
        
        
        </>
    );
}
export default StudyCard;