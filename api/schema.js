import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = `
  type User {
    id: ID! 
    email: String! 
    fullname: String! 
    bio: String 
    items: [Item] 
    borrowed: [Item] 
  }

  type Item {
    id: ID! 
    title: String! 
    imageurl: String
    tags: [Tag] 
    itemowner: User! 
    createdon: Int! 
    available: Boolean! 
    borrower: User 
    description: String
  }

  type Tag {
    id: Int!
    title: String!
    description: String!
  }

  input AssignedTag {
    id: Int!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    items: [Item]
    item(id: ID!): Item
    tag(id: ID!): Tag
  }

  type Mutation {
    addItem(
      title: String!
      imageurl: String
      itemowner: ID!
      description: String!
      tags: [AssignedTag]
    ): Item

    addUser(
      fullname: String!
      email: String!
      bio: String
      password: String!
    ): User
  } 
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers
})