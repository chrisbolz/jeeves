# Jeeves

Jeeves is an easy to set up and use JSON file server with support for CSS Level 3-like selectors.
JSON Mock API, orientiert an REST

## Setup

node?

### Configuration

Edit [config](config.json) file to set the port you want Jeeves to use.

### Starting the server

Install dependencies and start the server:

```
$ npm install
$ npm run dev
```

### Running tests

Install dev dependencies and run all tests:

```
$ npm install -d
$ npm test
```

## Usage

### Adding JSON files

All files inside the [files](files) directory are accessible. Just drop files you want to request in this folder.

### API

All examples in this readme refer to data from [test.json](files/test.json).

#### Simple query

You can query your files via JavaScript dot notation.
The first parameter is always the name of the file you want to query.

```
test.object
test.array
test.array[1].str
test.array.1.str
```

#### Using selectors

With Jeeves you can use CSS level 3-like selectors to query arrays inside your files.
Using a selector will always return an array. 
You may use selectors to GET, PUT, PATCH and DELETE.

**Careful**: The selector *must* be used on the last item of a query at the moment.

```
test.array[str==teststring] // Returns all array entries which str-property equals 'teststring'.
test.array[str*=stst]       // Returns all array entries which str-property contains 'stst'.
test.array[str^=test]       // Returns all array entries which str-property starts with 'test'.
test.array[str$=ring]       // Returns all array entries which str-property ends with 'ring'.
```

### Requests & Responses

Jeeves accepts GET, PUT, POST, PATCH and DELETE requests and is running on 
`http://localhost:3900` in default configuration.

Caught errors are returned as JSON, for example requesting a nonexistent file:

`HTTP 404, application/json`
```
{
    "status": 404,
    "message": "File not found",
    "error": {
        "errno": -2,
        "code": "ENOENT",
        "syscall": "open",
        "path": "/path/to/file/nonexistent.json"
    }
}
```

#### GET

Get an entity.

**Example request**

GET `http://localhost:3901/test.array[1]`

**Example response**

`HTTP 200, application/json`
```
{
  "int": 0,
  "bool": true,
  "str": "array0str"
}
```

#### PUT
Fully update an entity.

**Example request**
```
GET http://localhost:3901/test.array[1]
```

**Example response**

`HTTP 200, application/json`
```
{
  "int": 0,
  "bool": true,
  "str": "array0str"
}
```

#### POST
Create a new entity.

**Example request**
```
POST http://localhost:3901/test.array[1]
```

**Example response**

`HTTP 201, application/json`
```
{
  "int": 0,
  "bool": true,
  "str": "array0str"
}
```

#### PATCH
Partially update an entity.

**Example request**

PATCH http://localhost:3901/test.array[1]

Request body:
```
{

}
```

**Example response**

`HTTP 200, application/json`
```
{
  "int": 0,
  "bool": true,
  "str": "array0str"
}
```

#### DELETE
Delete an entity.

**Example request**
```
DELETE http://localhost:3901/test.array[1]
```

**Example response**

`HTTP 204`

## WIP

- Provide own files directory
- Continuing queries after selectors
- Undo/revert file functionality
- Work with entities and values derived from a selector
- Support for multiple selectors in a query: Access arrays in objects in arrays in objects...
- CLI with options(port, path)?
- Query parameters to further specify your request: ordering, limiting, ...


## Authors

**Christoph Bolz** - [GitHub](https://github.com/ChristophBolz)

## License

MIT - see [LICENSE](LICENSE.md)