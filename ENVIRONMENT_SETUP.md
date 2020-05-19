# Environment Setup for Development

## Getting Started

To begin you will need to install all the necessary tools to run the web application locally.

Start by installing the software stack depending you operating system. 

- If windows install the `WAMP` server stack
- If MacOS insall the `MAMP` server stack
- If Linux install the `LAMP` server stack

> Be sure to have Apache, MySQL and PHP installed and running.

After installing the stack, install the lastest version of `nodejs`

> At the moment of development for this application we were using version 13.7.0 

Once nodejs is installed make sure to install `npm` package manager to your system.

In addtion make sure to have `git` installed in your system to be able to clone the repository.

Once you have all the necessary tools installed in your system you can clone the repository using this command in your terminal:

```  
    git clone "https://github.com/welozano/assessmentEngInterBC.git"
```

Once you clone the repository enter the project folder.


```
     cd assessmentEngInterBC
```

After entering the folder you will need to run this command:

```
    npm install
```

`npm install` will install all of the project's dependencies.

To run the application use:

```
    node app.js
```

> **NOTE:** The database need to be create and needs to be populated with data. 

To create the database you will need to run:

``` 
mysql -u username -p < ABET_assessment.sql
```

```
{ Here goes other commands the are gonna be put later }
```

