
import fetch from 'node-fetch';

import {
  getUser,
  getUsers,
  addUser,
  createUser,
  getItems,
  getItem,
  getUserItems,
  getUserBorrowedItems,
  newItem,
  getTagsfromItem,
  getItemsFromTags  
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
      return context.loaders.UserOwnedItems.load(user.id)
    },
    borrowed: (user, args, context) => {
      return context.loaders.UserBorrowedItems.load(user.id)
    },
  },
  Item: {
    tags: (item) => {
      return postgres.getTagsfromItem(item.id)
    },
    itemowner(item, args, context) {
      return context.loaders.SingleUser.load(item.itemowner);
    },
    borrower(item, args, context) {
      if (!item.borrower) return null;
      return context.loaders.SingleUser.load(item.borrower);
    }
  },

  // Tags: {
  //   getTagsForItem() {
  //     context.loaders.getTagsfromItem.load();
  //   },
  //   getItemsForTags() {
  //     context.loaders.getItemsFromTags.load();
  //   }
  // },

  Mutation: {
    addItem(root, args) {
      return postgres.newItem(args);
    },
    addUser(root, args, context) {
      return postgres.createUser(args, context)
    }
  }
};

export default resolveFunctions;