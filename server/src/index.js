import { GraphQLServer, PubSub } from 'graphql-yoga';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Coment from './resolvers/Coment';
import prisma from './prisma'
const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        User,
        Coment,
        Post,
        Mutation
    },
    context: {
        pubsub,
        prisma
    }
})

server.start(() => {
    console.log(`The server is UP`);
})

