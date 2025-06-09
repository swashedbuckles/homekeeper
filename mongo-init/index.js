// This script will be executed when MongoDB container starts for the first time
// It creates a database user with appropriate permissions

// Create the root user in admin database
db = db.getSiblingDB('admin');
db.createUser({
  user: process.env.MONGO_ROOT_USERNAME,
  pwd: process.env.MONGO_ROOT_PASSWORD,
  roles: ["root"]
});

print("Root user created successfully!");

// Switch to App database and create app user
db = db.getSiblingDB(process.env.MONGO_DATABASE);
db.createUser({
  user: process.env.MONGO_APP_USERNAME,
  pwd: process.env.MONGO_APP_PASSWORD,
  roles: [
    {
      role: "readWrite", 
      db: process.env.MONGO_DATABASE
    }
  ]
});

print("App user created successfully!");

db.createCollection("users");

print("MongoDB initialization completed successfully!");