import React from 'react'
import { useState, useRef } from "react";
import { supabase } from '../supabaseClient';
import '../App.css'
import logo from '../assets/loading.gif'
import { CDBInput, CDBContainer } from 'cdbreact';


function AddImages({ file, setFile }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [enableUpload, setEnableUpload] = useState('');
    const [doneMessage, setDoneMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const callLambda = async() =>{
      const { data, error } = await supabase.functions.invoke('lambda', {
        body: { name: file.name, size: file.size, type: file.type, base64: file.base64},
      })
      setLoading(false)
      if(!error){
        setDoneMessage('Image uploaded successfully in the bucket : '+ data);
      }
      else{
        setDoneMessage('Explicit content detected!')
      }    
    }
    
    const uploadImage = async() =>{
        setEnableUpload(false);
        setLoading(true);
        //get base 64 of image
        let base64;
        // Make new FileReader
        let reader = new FileReader();
        // Convert the file to base64 text
        reader.readAsDataURL(file);
        reader.onload = () => {
          // from jpg image to base64
          base64 = reader.result.split(',')[1];
          let updatedFile = file;
          updatedFile.base64 = base64;
          // modify the file
          setFile(updatedFile);
          //call lambda with updated file
          callLambda();
        };
      }
    
    const setLocalFile = event => {
        setDoneMessage('')
        console.log(event.target.files[0])
        let image_type = event.target.files[0].type.split('/')[0]
        if( image_type == 'image' ) {
          setErrorMessage('')
          setEnableUpload(true)
          setFile(event.target.files[0]);
        }
        else {
          setEnableUpload(false)
          setErrorMessage('Please upload an image (png, jpg etc.)')
        }
    };
      
    return (
      <>
        <div>
              <CDBInput type="file" color="primary" onChange={setLocalFile} />
              <button disabled={!enableUpload} onClick={uploadImage} class="btn btn-primary">Upload image</button>
              {
                loading && (<img className='loading' src={logo} alt="loading..."/>)
              }
          </div>
          {
            errorMessage && (<p className='error'>{errorMessage}</p>)
          }
          {
            doneMessage && (<p className='message'>{doneMessage}</p>)
          }
      </>
    );
}

export default AddImages;