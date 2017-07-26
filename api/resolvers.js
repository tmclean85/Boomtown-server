
import fetch from 'node-fetch';
import {
  getItems,
  getItem,
  getUserItems,
  getUserBorrowedItems,
} from './jsonServer';

import {
  getUser,
  getUsers,
  addUser,
  createUser
} from './postgresDB';

const resolveFunctions = {
  Query: {
    users() {
      return getUsers();
    },
    user: (root, { id }, context) => {
      return context.loaders.SingleUser.load(id)
    },
    items() {
     return getItems();
    },
    item: (root, { id }, context) => {
      return context.loaders.SingleItem.load(id)
    },
  },

  User: {
    items: (user, args, context) => {
      // return getUserItems(user.id);
      return context.loaders.UserOwnedItems.load(user)
    },
    borrowed: (user, args, context) => {
      return context.loaders.UserBorrowedItems.load(user)
    },
  },
  Item: {
    itemOwner(item, args, context) {
      return context.loaders.SingleUser.load(item.itemOwner);
    },
    borrower(item, args, context) {
      if (!item.borrower) return null;
      return context.loaders.SingleUser.load(item.borrower);
    }
  },

  Mutation: {
    addItem(root, args) {
      const newItem = {
        title: args.title,
        imageUrl: args.imageUrl,
        borrower: null,
        itemOwner: args.itemOwner,
        description: args.description,
        tags: args.tags,
        createdOn: Math.floor(new Date.now() / 1000),
        available: true,
      };
      return postItem(newItem);
    },
    addUser(root, args) {
        return createUser(args)
    }
  }
}

export default resolveFunctions;