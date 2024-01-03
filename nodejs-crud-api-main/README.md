# nodejs-crud-api

# Project 

Containerized web app using React for frontend and a Node.js REST API to create/read/update/delete documents in a MongoDB collection.

The client sends REST request using GET, POST, DELETE, PUT methods to the backend server. The server handles the request and sends back a REST response to the client that handles it.

The user is able to:
-  Create a new document, by specifying at least the SIRET, SIREN and NIC fields. If one those fields is missing, an error message is displayed.
-  Update an existing document with SIRET number. If the specified document does not exist, a message is displayed.
-  Retrieve a document with SIRET number. If the specified document does not exist, an error message is displayed.
-  Delete a document with SIRET number. If the specified document does not exist, a error message is displayed. 

Every action is logged in two files in ```.\backend```:
- ```combined.log``` which contains every logged action
- ```app-error.log``` which only contains errors

Each log contains the type of action that was performed, the SIRET associated to the request as well as the timestamp of the action.

## Getting started 

You should have MongoDB installed locally with the data in a DB called *apiDB* and in a collection named *etablissements*

In the ```.env```, modify ```IP_ADDRESS``` to your own IPv4 address.
Add this same IP address to bindIp in the mongod configuration file.

To build and run the application, run the following command: 

``` docker-compose up --build ```

Open ```http://localhost:3000``` to access the app

To stop the application, run the following command: 

``` docker-compose down ```

# Technical choices

## MongoDB:

- Performant, powerful to handle 33 million records
- Easy to use : Importing data through Compass. Option to chose fields type on import
- Node.js API is well documented

### Creation of index

Indexing on ```siret```: Queries are performed on this field exclusively, indexing on this field improves performance.

### Fields type

```siret : String``` A SIRET is a 14 digits number that can start with zeros, if it were to be an integer, the zeros would be omitted.

```siren : String``` A SIREN is a 9 digits number that can start with zeros, if it were to be an integer, the zeros would be omitted.

```nic : String``` A NIC is a 5 digits number that can start with zeros, if it were to be an integer, the zeros would be omitted.

JSON schema: Following the definitions above of those three fields, we decided to create rules with a JSON schema to maintain data consistency and data quality.

```javascript
{
  $jsonSchema: {
    required: [
      'siret',
      'siren',
      'nic'
    ],
    properties: {
      siret: {
        pattern: '^\\d{14}$'
      },
      siren: {
        pattern: '^\\d{9}$'
      },
      nic: {
        pattern: '^\\d{5}$'
      }
    }
  }
}
```

## Front-end validation:

To add another layer of data validation, we added a pattern check on the frontend. This reduces server load and increases response time speed which ultimately improves user experience.

Exemple:

```html 
<input type="text" onChange={(event) => setSiret(event.target.value)} id="siret" placeholder='Enter SIRET' pattern="^\d{14}$" title="SIRET must be a 14 digits number" required/>
```

## Docker

Docker provides consistent development environment and easy deployment. We are using Docker Compose to run the frontend and backend in their respective container.


