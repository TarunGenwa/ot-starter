module.exports.createUser = {
    type: 'Mutation',
    args: {
        firstname: {type: new GraphQLNonNull(GraphQLString)},
        lastname: { type: new GraphQLNonNull(GraphQLString)},
        username: { type: new GraphQLNonNull(GraphQLString)},
        email: { type: new GraphQLNonNull(GraphQLString)},
        password: { type: new GraphQLNonNull(GraphQLString)},
    },
    returnType: 'User',
    resolver: async ( _, args) => {
        console.log (args )
    }
}