import express from 'express';
import { } from 'dotenv/config';
import bodyParser from 'body-parser';
import {
  graphqlExpress,
  graphiqlExpress 
} from 'graphql-server-express';
import cors from 'cors';
import schema from './api/schema';
import createLoaders from './api/loaders';
import admin from './database/firebase.js';

const app = express();
const GQL_PORT = 5000;
const PORT = process.env.PORT;

app.use('*', cors());
app.use(bodyParser.json());


// if(process.env.NODE_ENV === 'production') {
//   const root = `$(_dirname)/public`
//   app.use(express.static(root));
//   app.use(fallback('index.html', { root }));
// }


app.use('/graphql', graphqlExpress({
  schema,
  context: {
    loaders: createLoaders()
  }
}));

app.use('/graphql', graphiqlExpress(function(req, res){
  return {
    schema,
    context: {
      loaders: createLoaders()
    }
  }
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(GQL_PORT, () => console.log(
  `GraphQL is now running on http://localhost:${GQL_PORT}/graphql`
));