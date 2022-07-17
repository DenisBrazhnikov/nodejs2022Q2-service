import { Injectable } from '@nestjs/common';

@Injectable()
export class Database<Model extends { id: string }> {
  private list: Model[] = [];

  create(item: Model) {
    this.list.push(item);

    return item;
  }

  find(id: string) {
    const item = this.list.find((item) => item.id === id);

    return item || null;
  }

  all() {
    return this.list;
  }

  update(id: string, data: Partial<Model>) {
    const item = this.find(id);

    if (item) {
      return Object.assign(item, data);
    }

    return null;
  }

  delete(id: string) {
    const item = this.find(id);

    if (!item) {
      return null;
    }

    this.list = this.list.filter((item) => item.id !== id);

    return item;
  }
}
