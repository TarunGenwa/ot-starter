const express 		= require('express');
const bodyParser    = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const cors          = require('cors');
const pe            = require('parse-error');
const config        = require('./config');
const models        = require('./models');
const jwt           = require('express-jwt');
const graphql       = require('graphql')
const { GraphApi, GraphqlResolvers, GraphqlSequelize } = require('../graphql-modules')
const { GraphQLSchema } = graphql

const app = express();
app.use(cors('*'));

const authMiddleware = jwt({
    secret: config.jwt_encryption,
    credentialsRequired: false,//important to not throw error
});
app.use(authMiddleware);

let dbModels = {};
for(let name in models){
    if(name == 'sequelize' || name == 'Sequelize') continue;
    dbModels[name] = models[name];
}

const resolverInstance = new GraphqlResolvers({
    resolverPath : '/resolvers'
}) 

    
const schema = new GraphQLSchema({
    query       :   resolverInstance.getRootQuery(),
    mutation    :   resolverInstance.getRootMutation()
})

const server = new ApolloServer({
    schema,    
    playground: true,
    context:({req}) => ({
        user: req.user,
    }),
})

server.applyMiddleware(app)

app.listen({ port: config.port }, () =>
    console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`),
);

process.on('unhandledRejection', error => {//This is here to handle all the uncaught promise rejections
    console.error('Uncaught Error', pe(error));
});