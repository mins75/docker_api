import axios from 'axios'
import { useState } from 'react';


function DeleteForm(){
    const [siret, setSiret] = useState('');
    const [response, setResponse] = useState('');

    async function drop(event) {
        event.preventDefault();

        try {
            const res = await axios.delete(`http://localhost:5000/${siret}`)
            console.log(res.data)
            setResponse(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form onSubmit={drop} onChange={(event) => setSiret(event.target.value)}>
                <input type="text" id="siret" placeholder='Enter SIRET' pattern="^\d{14}$" title="SIRET must be a 14 digits number" required/>
                <button type='submit'>Submit</button>
            </form>
            <div>
                <p>{response}</p>
            </div>
        </div>
    )

}

export default DeleteForm;