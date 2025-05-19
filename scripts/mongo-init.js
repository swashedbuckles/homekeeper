// This script will be executed when MongoDB container starts for the first time
// It creates a database user with appropriate permissions

db.auth(process.env.MONGO_ROOT_USERNAME, process.env.MONGO_ROOT_PASSWORD)

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

// Create some initial collections
db.createCollection("users");
db.createCollection("manuals");
db.createCollection("categories");

print("MongoDB initialization completed successfully!");
