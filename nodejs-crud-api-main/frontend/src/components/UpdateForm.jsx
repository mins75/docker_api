import axios from 'axios'
import { useState } from 'react';

function UpdateForm() {

    const [fields, setFields] = useState([{field:'', value:''}, ]);
    const [response, setResponse] = useState("");

    const handleFormChange = (event, index) => {
        let data = [...fields];
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        data[index][fieldName] = fieldValue;

        if(fieldName === 'field'){
            
            if(fieldValue==='siret'){
                data[index]['valuePattern']= "^\\d{14}$"

            } else if(fieldValue==='siren'){
                data[index]['valuePattern']= "^\\d{9}$"

            } else if(fieldValue==="nic"){
                data[index]['valuePattern']= "^\\d{5}$"
            }

        }
        
        setFields(data);
        
    }

    const removeField = (i) => {
        let newFields = [...fields];
        newFields.splice(i, 1);
        setFields(newFields)

    }

    const addField = () => {
        setFields([...fields, {field: '', value:''}])
        
    }

    async function update(event) {
        event.preventDefault();
        let  update = {}
        let hasErrors = false;
        let hasSiret = false;
        try {
            
            fields.forEach((obj) => {
                // Data valdation, checking if the value matches the associated regular expression
                const { field, value, valuePattern} = obj;
                const isValid = valuePattern ? new RegExp(valuePattern).test(value) : true;

                if(!isValid){
                    hasErrors = true;
                    update[field] = value;
                    setResponse(`Invalid value for field ${field}: ${value}`);

                } else {
                    update[field] = value;
                }       
            })

            // Check if 'siret' field is present in object 

            hasSiret = update.hasOwnProperty('siret')

            if(!hasSiret){
                hasErrors = true
                setResponse("Unable to update, 'siret' field is missing");
            }

            // If data is validated and all mandatory fields are present, send request with axios

            if(!hasErrors && hasSiret){
                const siret = update.siret
                const res = await axios.put(`http://localhost:5000/${siret}`, {"update": update})
                setResponse(res.data)

            }
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div class="multi-button">
            <form onSubmit={update}>
                {fields.map((form, index) => {
                    return (
                        <div key={index}>
                            <input name='field' 
                            placeholder='Enter field name' 
                            onChange={(event) => handleFormChange(event, index)}
                            value={form.field} required/>
                            <input name='value'
                            placeholder='Enter value'
                            value={form.value}
                            onChange={(event) => handleFormChange(event, index)} required/>
                            <button id= "buttonz" onClick={() => removeField(index)}><i class="fas fa-minus"></i>Remove</button>
                            <button id="buttonz" onClick={addField}><i class="fas fa-plus"></i>Add Field</button>
                        </div>
                    
                    )
                })}
                <button type='submit'>Submit</button>
            </form>
            <div>
                <p>{response}</p>
            </div>
        </div>
    )

}

export default UpdateForm;