
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CreateCategoryInput {
    name: string;
    parentId?: number;
}

export class CreateGeolocationInput {
    latitude: number;
    longitude: number;
    date: Date;
}

export class CreateRecordInput {
    name: string;
    value: number;
    tagIds: number[];
    categoryId: number;
    description?: string;
    date: Date;
}

export class CreateTagInput {
    name: string;
}

export class Category {
    id?: number;
    name?: string;
    userId?: number;
    parentId?: number;
}

export class Geolocation {
    id: number;
    latitude: number;
    longitude: number;
    date: Date;
}

export abstract class IMutation {
    abstract createCategory(createCategoryInput?: CreateCategoryInput): Category | Promise<Category>;

    abstract createGeolocation(latitude: number, longitude: number, date: Date): Geolocation | Promise<Geolocation>;

    abstract createRecord(createRecordInput?: CreateRecordInput): Record | Promise<Record>;

    abstract createTag(createTagInput?: CreateTagInput): Tag | Promise<Tag>;
}

export abstract class IQuery {
    abstract getCategories(pageSize?: number, keyword?: string, cursor?: number): Category[] | Promise<Category[]>;

    abstract category(id: string): Category | Promise<Category>;

    abstract getGeolocation(from?: Date, to?: Date): Geolocation[] | Promise<Geolocation[]>;

    abstract geolocation(): Geolocation | Promise<Geolocation>;

    abstract getRecords(): Record[] | Promise<Record[]>;

    abstract record(id: string): Record | Promise<Record>;

    abstract getTags(): Tag[] | Promise<Tag[]>;

    abstract tag(id: string): Tag | Promise<Tag>;

    abstract user(): User | Promise<User>;
}

export class Record {
    id: number;
    name: string;
    value: number;
    tags: Tag[];
    category: Category;
    description?: string;
    userId: number;
    date: Date;
}

export abstract class ISubscription {
    abstract geolocationCreated(): Geolocation | Promise<Geolocation>;
}

export class Tag {
    id: number;
    name: string;
}

export class User {
    id: number;
    uid?: number;
    username?: string;
    displayName?: string;
    email?: string;
    avatar?: string;
    domain: string;
    phone?: string;
}
