import express from 'express';
import bodyParser from 'body-parser';
import { 
  graphqlExpress, 
  graphiqlExpress 
} from 'graphql-server-express';
import cors from 'cors';
import schema from './api/schema';
import createLoaders from './api/loaders';

const app = express();

const GQL_PORT = 5000;

app.use('*', cors());

app.use('/graphql', bodyParser.json(), graphqlExpress({ 
  schema,
  context: {
    loaders: createLoaders()
  }
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(GQL_PORT, () => console.log(
  `GraphQL is now running on http://localhost:${GQL_PORT}/graphql`
));