export interface DatabaseInterface<Model = unknown> {
  create: (data: Model) => Model | Promise<Model>;
  all: () => Model[] | Promise<Model[]>;
  find: (id: string) => Model | Promise<Model>;
  update: (id: string, data: Partial<Model>) => Model | Promise<Model>;
  delete: (id: string) => Model | Promise<Model>;
}
