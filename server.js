const express = require('express')
const {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema
} = require('graphql')

const { graphqlHTTP } = require('express-graphql')

const app = express()

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'People with knowledge and wisdom',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
      description: 'where is this gona be?'
    },
    name: {
      type: GraphQLNonNull(GraphQLString)
    },
    books: {
      type: GraphQLList(BookType),
      resolve: author => books.filter(book => book.authorId === author.id)
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'Reading Material',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt)
    },
    title: {
      type: GraphQLNonNull(GraphQLString)
    },
    authorId: {
      type: GraphQLNonNull(GraphQLInt)
    },
    author: {
      type: AuthorType,
      resolve: book => authors.find(author => author.id === book.authorId)
    }
  })
})

const authors = [
  {
    id: 1,
    name: 'tom'
  },
  {
    id: 2,
    name: 'jack'
  }
]

const books = [
  {
    id: 1,
    title: 'Great Expectation',
    authorId: 1
  },
  {
    id: 2,
    title: 'Last King',
    authorId: 1
  },
  {
    id: 3,
    title: 'Donald Duck',
    authorId: 2
  },
  {
    id: 4,
    title: 'Casabranka',
    authorId: 2
  },
  {
    id: 5,
    title: 'Twin City',
    authorId: 2
  }
]

const RootQuery = new GraphQLObjectType({
  name: 'Queries',
  description: 'queries defined here',
  fields: {
    book: {
      type: BookType,
      description: 'single book',
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    books: {
      type: GraphQLList(BookType),
      description: 'all books',
      resolve: () => books
    },
    author: {
      type: AuthorType,
      description: 'single author',
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    authors: {
      type: GraphQLList(AuthorType),
      description: 'all authors',
      resolve: () => authors
    }
  }
})

const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'making changes here',
  fields: {
    addBook: {
      type: BookType,
      description: 'add book here',
      args: {
        title: {
          type: GraphQLNonNull(GraphQLString)
        },
        authorId: {
          type: GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          title: args.title,
          authorId: args.authorId
        }
        books.push(book)
        return book
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'add a author here',
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name }
        authors.push(author)
        return author
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
)

app.listen(3000, () => console.log('listening on port 3000'))
