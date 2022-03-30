import  React,{useState, useRef, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
const baseUrl = 'https://imransecretservice.herokuapp.com/v1/secret'
function App() {
    const [secret, setSecret] = useState('')
    const [expire, setExpire] = useState('')
    const [hash, setHash] = useState('')
    const [secretList, setSecretList] = useState([])
    const hashValue = useRef();
    const ttl = useRef();
    useEffect(() => {
        fetch(baseUrl).then(response => response.json()).then(data => {
            setSecretList(data)
        }).catch(err => {console.log(err)});   
    },[])
    function RetrieveSecret(e){
        e.preventDefault();
        const hash = hashValue.current.value;
        console.log(hash)
        const url = baseUrl +"/"+ hash;
        fetch(url).then(response => response.json()).then(data => {
            setSecret(data.name)
            setExpire(data.expireAfter)
        }).catch(err => {console.log(err)});     
    }
   
    function GenerateSecret(e){ 
        e.preventDefault();
        setSecret("secret"+uuidv4())
    }

    function SaveSecret(e){
        e.preventDefault();
        setSecret('')
        const payload = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"name":secret, "expireAfter":ttl.current.value}),
          }
        fetch(baseUrl, payload).then(response => response.json())
        .then(data => {
            setHash(data.schema.uuid)
        }).catch((err) => {
          console.log(err);
        });      
    }
    function isExpired(createdAt, expireAfter){
        var t1 = new Date(createdAt);
        let date_ob = new Date();
        var tins = (date_ob - t1)/1000;
        console.log(tins)
        if (expireAfter < tins){
            return "true" 
        }
            return "false"
    }

    return(
        <div>
            Secret Generator : <button onClick={GenerateSecret}>Generate Secret</button>
            <h1>{secret}</h1> {secret && <h1> TTL in sec:<input type="text" ref={ttl}></input></h1>} 
            <button onClick={SaveSecret}>Save Secret</button> 
            <h1>{hash && <h1>hash of save secret</h1>}</h1><h1>{hash}</h1>

            Enter Hash value to retrieve Secret : <input type="text" ref={hashValue} /> 
            <button onClick={RetrieveSecret}>Retrieve Secret</button>
            <h1>{secret}</h1> <h1>{expire}</h1>

            List of secrets with expiry details <br/>
            {Object.keys(secretList).map(secret => {
               return ( 
               <>
                    <span >secret : {secretList[secret].name} {"=>"} </span>
                    <span >hash : {secretList[secret].uuid} {"=>"} </span>
                    <span>expired : {isExpired(secretList[secret].createdAt, secretList[secret].expireAfter)}</span>
                    <br />
                </>)
            })}
                    
        </div>
    )
}

export default App;