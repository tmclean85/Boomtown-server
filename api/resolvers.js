
import fetch from 'node-fetch';
import pool from '../database/index';
import * as postgres from './postgresDB';

const resolveFunctions = {
  Query: {
    users() {
      return postgres.getUsers();
    },
    user: (root, { id }, context) => {
      return context.loaders.SingleUser.load(id)
    },
    items() {
     return postgres.getItems();
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
      return context.loaders.UserBorrowedItems.load(user)
    },
  },
  Item: {
    tags: (item, { }, context) => {
      return postgres.getTagsfromItem(item.id)
    },
    itemowner: (item, args, context) => {
      return context.loaders.SingleUser.load(item.itemowner);
    },
    borrower: (user, args, context) => {
      return context.loaders.UserBorrowedItems.load(user.id);
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
      return postgres.newItem(args, context);
    },
    addUser(root, args, context) {
      return postgres.createUser(args, context)
    }
  }
};

export default resolveFunctions;