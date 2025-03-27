#!/bin/bash

HOST="00.00.000.00:00000"                                                                                                             
USERNAME="user"
PASSWORD="password"
DB_NAME="mydb"

CSV_EXTENSION=".json"

# Get the directory path of the script
SCRIPT_DIRECTORY="$(pwd)"

for fullFilePath in "$SCRIPT_DIRECTORY"/*
do
  
  fileName="${fullFilePath##*/}"
  
  fileNameWithoutExtension="${fileName%.[^.]*}"
  
  fileExtension="${fileName:${#fileNameWithoutExtension}}"
  fileExtensionLowerCase="${fileExtension,,}"
  
  if [ "$fileExtensionLowerCase" == "$CSV_EXTENSION" ]; then
  
      echo "importing collection: $fileNameWithoutExtension ..."
      
      # mongoimport --file="$fullFilePath" --type csv --headerline --db="$DB_NAME" --collection="$fileNameWithoutExtension" --host="$HOST" -u="$USERNAME" -p="$PASSWORD" --authenticationMechanism SCRAM-SHA-256 --authenticationDatabase admin

      mongoimport --uri mongodb+srv://lazaqy:Gt7rqex2v7gqWTqs@mystore.y5rdr.mongodb.net/test --collection products --type json --file importProduct.json

  fi
  
done