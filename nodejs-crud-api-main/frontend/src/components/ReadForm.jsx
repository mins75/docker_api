import axios from 'axios'
import { useState } from 'react';

function ReadForm(){
    const [siret, setSiret] = useState('');
    const [document, setDocument] = useState();
    const [keys, setKeys] = useState([]);

    async function read(event) {
        event.preventDefault();

        try {

            const res = await axios.get(`http://localhost:5000/${siret}`)
            setDocument(res.data)
            setKeys(Object.keys(res.data))
            
        } catch (error) {
            console.log(error)
          
        }
    }

    return (
        <div>
            <form onSubmit={read} >
                <input type="text" onChange={(event) => setSiret(event.target.value)} id="siret" placeholder='Enter SIRET' pattern="^\d{14}$" title="SIRET must be a 14 digits number" required/>
                <button type='submit'>Submit</button>
            </form>
            <div>
                {keys.map((key) => <p><strong>{key}</strong>: {document[key]}</p>)}
            </div>
        </div>
    )


}

export default ReadForm;