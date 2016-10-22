import * as _ from 'underscore';

import { Books, Authors, Publishers, Categories } from './data';

import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLInterfaceType
} from 'graphql';

// define Enum types
const CategoryEnum = {};
Categories.forEach(c => {
  CategoryEnum[c.name] = {
    value: c._id
  };
});

const Category = new GraphQLEnumType({
  name: "Category",
  description: "A Category of books",
  values: CategoryEnum
});

// define GraphQL Objects
const Book = new GraphQLObjectType({
  name: "Books",
  description: "GraphQL Object model for the Book",
  fields: () => ({
    _id: {type: GraphQLString},
    ISBN: {type: GraphQLString},
    title: {type: GraphQLString},
    author: {type: GraphQLString},
    publisher: {type: GraphQLString},
    category: {type: Category},
  })
});

const Author = new GraphQLObjectType({
  name: "Author",
  description: "GraphQL Object model for the Author",
  fields: () => ({
    _id: {type: GraphQLString},
    name: {type: GraphQLString}
  })
});

const Publisher = new GraphQLObjectType({
  name: "Publisher",
  description: "GraphQL Object model for the Publisher",
  fields: () => ({
    _id: {type: GraphQLString},
    name: {type: GraphQLString}
  })
});

// Query 
const Query = new GraphQLObjectType({
  name: "LibrarySchema",
  description: "Root of the Library Schema",
  fields: () => ({
    books: {
      type: new GraphQLList(Book),
      description: "List of books in the library",
      args: {
        category: {type: Category}
      },
      resolve: function(source, {category}) {
        if(category) {
          return _.filter(Books, book => book.category === category);
        } else {
          return Books;
        }
      }
    }
  })
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: "LibraryMutations",
  fields: {
    addABook: {
      type: Book,
      description: "Add a book to library",
      args: {
        _id: {type: new GraphQLNonNull(GraphQLString)},
        ISBN: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        author: {type: new GraphQLNonNull(GraphQLString)},
        publisher: {type: GraphQLString},
        category: {type: Category}
      },
      resolve: function(source, {...args}) {
        let book = args;
        var alreadyExists = _.findIndex(Books, b => b._id === book._id) >= 0;
        if(alreadyExists) {
          throw new Error("Book ID already exists: " + book._id);
        }

        Books.push(book);
        return book;
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
