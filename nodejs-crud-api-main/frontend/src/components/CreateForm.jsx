import axios from 'axios'
import { useState } from 'react';

function CreateForm() {

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

    async function create(event) {
        event.preventDefault();
        console.log("fields", fields)
        let hasErrors = false;
        let completeField = true;
        
        try {
            let  doc = {}
  
            fields.forEach((obj) => {
                // Data valdation, checking if the value matches the associated regular expression
                const { field, value, valuePattern} = obj;
                const isValid = valuePattern ? new RegExp(valuePattern).test(value) : true;

                if(!isValid){
                    hasErrors = true
                    doc[field] = value;
                    setResponse(`Invalid value for field ${field}: ${value}`);
                } else {
                    doc[field] = value;
                    
                    
                }
                
            })

            // Check if all mandatory fields are present in the object 

            completeField = (doc.hasOwnProperty('siret') && doc.hasOwnProperty('siren') && doc.hasOwnProperty('nic'));

            if(!completeField){
                setResponse("Failed insertion, document must have 'siret', 'siren' and 'nic' fields")
            }
        
            // If data is validated and all mandatory fields are present, send request with axios
            if(!hasErrors && completeField){
                const res = await axios.post('http://localhost:5000', doc)
                setResponse(res.data)
            

            }
 
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div class="multi-button">
            <form onSubmit={create}>
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


export default CreateForm;