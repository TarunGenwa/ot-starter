const express 		= require('express');
const bodyParser    = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
// const GraphQLHttp   = require('express-graphql')
const cors          = require('cors');
const pe            = require('parse-error');
const config        = require('./config');
const models        = require('./models');
const jwt           = require('express-jwt');
const graphql       = require('graphql')
const { GraphqlSequelize } = require('../graphql-modules')
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = graphql
const { resolver } = require('graphql-sequelize')
const app = express();
app.use(cors('*'));

const authMiddleware = jwt({
    secret: config.jwt_encryption,
    credentialsRequired: false,//important to not throw error
});
app.use(authMiddleware);

// eliminate the default sequelize objectsxs
let dbModels = {};
for(let name in models){
    if(name == 'sequelize' || name == 'Sequelize') continue;
    dbModels[name] = models[name];
}

const seqInstance = new GraphqlSequelize({
    models: dbModels,
})
let x = seqInstance.getTypeDefsList()
console.log('typedefs',x)


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        user: {
            type: x["user"],
            args: {
                username: { type: GraphQLString }
            },
            resolve: resolver(dbModels["user"])
        }
    }
})


const schema = new GraphQLSchema({
    query       :   RootQuery,
})
// console.log(schema)

// app.use('/graphql', authMiddleware, GraphQLHttp((req)=>({
//     schema,
//     context: {
//         user: req.user
//     },
//     graphiql: true
// }))
// )
const server = new ApolloServer({
    schema,    
    playground: true,
    context:({req}) => ({
        user: req.user,
    }),
})

server.applyMiddleware({app})

app.listen({ port: config.port }, () =>
    console.log(`🚀 Server ready at http://localhost:${config.port}`),
);

process.on('unhandledRejection', error => {//This is here to handle all the uncaught promise rejections
    console.error('Uncaught Error', pe(error));
});