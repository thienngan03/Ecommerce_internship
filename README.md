# Ecommerce_internship

### 1. Clone the repository

```bash
git clone https://github.com/thienngan03/Ecommerce_internship.git
cd Ecommercial_internship
```

### 2. Install dependencies

Navigate to the `server` and `client` directories and install the required packages:

```bash
# For the server
cd server
npm install

# For the client
cd ../client
npm install
```

### 3. Create the database

Ensure that you have created the MySQL database as specified in the `.env` file:

```sql
CREATE DATABASE smallshop;
```

### 4. Configure environment variables

Create the `.env` file in the `server` directory with the following values:

```properties
MYSQL_DATABASE_NAME = "smallShop" # your database
MYSQL_USERNAME = your_mysql_username
MYSQL_PASSWORD = your_mysql_password
MYSQL_HOST = "localhost"
MYSQL_PORT = 3306
PORT =8080

ACCESS_TOKEN_SECRET = your_secret_here
ACCESS_TOKEN_EXPIRE = "1d"
REFRESH_TOKEN_SECRET = your_secret_here
REFRESH_TOKEN_EXPIRE = "7d"
COOKIE_EXPIRE = 10800000

TRANSACTION_SECRET = your_merchant_serectkey
TRANSACTION_EXPIRE = "30m"
MERCHANT_CODE = merchant_code
STORE = store_code
TRANSACTION_URL = api_url_payment
TRANSACTION_CHECK_URL = api_url_checktrans
```

### 5. Start the server

Start the server using the following command:

```bash
cd server
npm start
```

### 6. Start the client

Navigate to the `client` directory and start the client:

```bash
cd ../client
npm run dev
```

### 7. (Optional) Add mock data

To create mock data, you can run the `databaseScript.sql` file in MySQL Workbench to add mock data to the database (after initializing the data using `npm start` in the server folder).
Make sure that database_name of function "use database_name" in `databaseScript.sql` file is thesame with `MYSQL_DATABASE_NAME` in .env file
## Usage

### Testing Account
  - **Password:** `password`
  - user 1 to 50 is buyer, 51 to 100 is seller

