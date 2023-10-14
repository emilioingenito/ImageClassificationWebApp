import React from 'react'
import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

function DisplayImages() {

    const supabase_url = 'https://jsnykdczxbblcbkallpz.supabase.co/storage/v1/object/public/images/'
    const [imgs, setImgs] = useState(null)

    

    const fetchImgs = async () => {
        const { data, error } = await supabase
            .from('images')
            .select('*')
            .limit(10)
            .order('rating', { ascending: false });
        setImgs(data)
    }

    useEffect(() => {
        fetchImgs();
      }, []);

      return (
        <div className='container'>
            <TitlebarImageList />
        </div>
      )
      /*
    return (
        <>
        <div className='container'>
        {imgs != null &&
            imgs.map((singleImg, index) => (<div><img src={supabase_url+singleImg.label+':'+singleImg.name} height={200} width={200}/><p>{singleImg.name.split(':')[0]}</p></div>))
        }
        </div>
        </>
    )
        */



function TitlebarImageList() {
  return (
    <ImageList sx={{ width: 900, height: 850 }} cols={1} gap={80} align="center">
      <ImageListItem key="Subheader" cols={1}>
        <ListSubheader component="div" align="center">Top Images</ListSubheader>
      </ImageListItem>

      {imgs && imgs.map((item, index) => (
        <ImageListItem key={item.img} sx={{ 
            width: 400, 
            height: 350,
            position: 'relative',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }} align="center">
          <img
            src={supabase_url+item.label+':'+item.name + "?w=164&h=164&fit=crop&auto=format"}
            srcSet={supabase_url+item.label+':'+item.name + "?w=248&fit=crop&auto=format&dpr=2 2x`"}
            alt={item.label}
            loading="lazy"
            align="center"
          />
          <ImageListItemBar
            align="center"
            title={item.label}
            subtitle={"Image number " + (index + 1) + "\n Rating " + item.rating}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${item.label}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

}

export default DisplayImages