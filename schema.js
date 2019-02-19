import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
    
    enum param {
        subject
        email
        platform
        verb
        title
    }
    
    enum columns {
        quiz
        post
    }
    
    type User {
        name: String
        email: String
        role: String
    }
    
    type Note {
         _id: ID!
         verb: String
         title: String
         text: String!
         courseRef: String
         course: String
         activityRef: String
         activity: String
         subjectRef: String
         createdAt: String
         updatedAt: String
         platform: String
         author: User
         sentiment: Sentiment
    }
    
    type Sentiment {
        neg: Float 
        neu: Float 
        pos: Float 
        compound: Float
    }
    
    type Occupation {
        title: String
        uri: String
        skills: [Skill]
    }
    
    type Skill {
        title: String
        uri: String
    }
    
    type Ontask {
        email: String!
        title: String!
        count: Float!
        extra: String
    }
    
    type Quiz {
        score: Float
        title: String
        verb: String
        activity:String
        course:String
        courseRef: String
        subjectRef: String
        author: User!    
    }
   
    type Query {
        
        getSentiment(text: String): Sentiment
        searchNotes(search:param, value: String!): [Note]
        getOccupations(search: String!): [Occupation]
        getQuiz (search:param, value: String!): [Quiz]
    }  
    
`;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export default schema;