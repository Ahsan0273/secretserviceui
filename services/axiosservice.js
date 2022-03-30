const baseUrl = 'http://localhost:3000/v1/secret'
async function getSecret(uuid){
    const url = baseUrl +"/"+ uuid;
     console.log("url" +  url)
    try{
      const result = await fetch(url);
      const jsonresult = await result.json();
      return jsonresult;
    }catch(err){
      return err.message
    }
}

async function saveSecret(data){
   const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }
   await fetch(baseUrl, payload)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      return data;
    }).catch((err) => {
      console.log(err);
      return err;
    });
}
export {
    getSecret,
    saveSecret
}