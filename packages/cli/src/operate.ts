const operations: any = {
  create: {
    alias: 'c',
    description: 'create a template project',
    examples: ['ystore create <project-name>'],
  },
  clean: {
    alias: 'cl',
    description: 'clean the cache in local disk',
    examples: ['ystore clean'],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};

export default operations;
