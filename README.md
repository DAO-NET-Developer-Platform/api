# DAO-NET-Developer-Platform API

This is a simple structured express application to get you started in build your own DAO decentralized autonomous organization. DAO-Net is production ready with mongodb and redis database.

## Installation & Setup ##

If you dont't have an existing server; You could get $100 in credit over 60 days from Digitalocean to deploy this. Signup [here](https://m.do.co/c/5caff7bbbeaa).

`git clone https://github.com/DAO-NET-Developer-Platform/api.git`

`cd api`

`npm i`

`touch .env`

You will need to have [Mongodb](https://docs.mongodb.com/manual/installation/) and [Redis](https://redis.io/download) installed on your system to use both connectors. Update the `.env` file.

```javascript
DB_URL=mongodb://localhost:27017/my_database
PORT=3000

```

Start your server with `npm start` and you are ready to start building

