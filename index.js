import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import mongoose from 'mongoose';
import schema from './schema';
import resolvers from './resolvers';
require ('dotenv').config();
import { EscoAPI } from './services/esco';


const configurations = {
    PROD: { ssl: false, port: 443, hostname: process.env.HOST_NAME_PROD },
    DEV: { ssl: false, port: 8080, hostname: process.env.HOST_NAME_LOCAL }
};

const environment = process.env.NODE_ENV || 'production';
const config = configurations[environment];
const apollo = new ApolloServer({
        schema,
        resolvers,
        dataSources: () => {
            return {
                esco: new EscoAPI()
            };
        },
        context: ({req}) => {
            // we can somehow obtain this via aaf preferably - etc Fake token
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
            const user = getUser(token);

            if (!user) throw new AuthenticationError('you must be logged in');

            // add the user to the context
            return { user };
        }
});

const app = express();
apollo.applyMiddleware({ app });
app.use(cors());

var server;


if (config.ssl) {
    // Assumes certificates are in .ssl folder from package root. Make sure the files
    // are secured.
    server = https.createServer(
        {
            key: fs.readFileSync(`./ssl/${environment}/server.key`),
            cert: fs.readFileSync(`./ssl/${environment}/server.crt`)
        },
        app
    )
} else {
    server = http.createServer(app)
}
apollo.installSubscriptionHandlers(server);

server.listen({ port: config.port }, () =>
    console.log(
        '🚀 Server ready at',
        `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`
    )
);


const PORT = 8080;
const MONGO_DB= process.env.MONGO_DB;
const MONGO_URL= process.env.MONGO_URL;
const MONGO_DB_USER= process.env.MONGO_DB_USER;
const MONGO_DB_PASSWORD=process.env.MONGO_DB_PASSWORD;


mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_URL}:27017/${MONGO_DB}`, { useNewUrlParser: true });


mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ');
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

/** mock up data to mimic JWT token authentication **/
let userMocks = [
    {
        id: 1234567,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IktpcnN0eSBLaXR0byIsImlhdCI6MTUxNjIzOTAyMn0.yDLl7SY3xJBWup5bFk_NVgnAe7qt38wGzsiZHCxdDOI',
        roles: ['admin'],
        name: 'Kirsty Kitto'
    },
    {
        id: 1234567,
        token: 'eyJhbGciOiJIUzI1NhIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IktpcnN0eSBLaXR0byIsImlhdCI6MTUxNjIzOTAyMn0.yDLl7SY3xJBWup5bFk_NVgnAe7qt38wGzsiZHCxdDOI',
        roles: ['student'],
        name: 'Test student'
    }
];


function getUser(token) {
    /* let usr = userMocks.filter( (data) => {
        return data.token === token;
    }); */
    return userMocks[0];
}
