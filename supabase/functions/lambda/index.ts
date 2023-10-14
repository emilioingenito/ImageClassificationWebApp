import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'
import { base64 } from "https://cdn.jsdelivr.net/gh/hexagon/base64@1/src/base64.js";


function isExplicit(safeSearchJson: any){
  const adult = safeSearchJson.responses[0].safeSearchAnnotation.adult
  const spoof = safeSearchJson.responses[0].safeSearchAnnotation.spoof
  const medical = safeSearchJson.responses[0].safeSearchAnnotation.medical
  const violence = safeSearchJson.responses[0].safeSearchAnnotation.violence
  const racy = safeSearchJson.responses[0].safeSearchAnnotation.racy

  const explicits = [adult, spoof, medical, violence, racy]

  return !explicits.every(explicit => explicit === 'VERY_UNLIKELY' || explicit === 'UNLIKELY' )
  
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  } 
  
  try {
    const file = await req.json()
    const auth = 'Bearer '+Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: auth } } }
    )

    // send request of explicit content detection to GOOGLE_CLOUD_VISION
    const safeSearchRequest = {
      "requests": [
        {
          "image": {
            "content": file.base64
          },
          "features": [
            {
              "type": "SAFE_SEARCH_DETECTION"
            },
          ]
        }
      ]
    }

    const safeSearchResponse = await fetch(
      Deno.env.get('GOOGLE_VISION_URL') ?? '', {
      method : 'POST',
      mode : 'cors',
      body : JSON.stringify(safeSearchRequest)
    });

    const safeSearchJson = await safeSearchResponse.json();
    const isExplicitContent = isExplicit(safeSearchJson)

    if(isExplicitContent){
      return new Response(JSON.stringify({ error: "Explicit Content Detected" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
  

    // send request of labeling to GOOGLE_CLOUD_VISION
    const request = {
      "requests":[
        {
          "image":{
            "content": file.base64
          },
          "features":[
            {
              "type":"LABEL_DETECTION",
              "maxResults":1
            }
          ]
        }
      ]
    }

    const response = await fetch(
      Deno.env.get('GOOGLE_VISION_URL') ?? '', {
      method : 'POST',
      mode : 'cors',
      body : JSON.stringify(request)
    });

    const datas = await response.json();
    const label = datas.responses[0].labelAnnotations[0].description
    const name = label+':'+file.name
    const date_ob = new Date();

    // current date as DD
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    const timest = year + "-" + month + "-" + date + hours + ":" + minutes + ":" + seconds;

    // insert image in the bucket
    const { data, error } = await supabaseClient.storage
    .from('images')
    .upload( name+timest, base64.toArrayBuffer(file.base64), {
      contentType: 'image/jpg'})

    if(!error) {
      // insert image row in the database
      const { _ } = await supabaseClient
        .from('images')
        .insert({ name: file.name+timest, size: file.size, label: label })
    }
    else{
      console.log(error)
    }

    //craft the response to be sent to the client
    return new Response(JSON.stringify(label), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

