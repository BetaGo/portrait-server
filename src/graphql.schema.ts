
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CreateCategoryInput {
    name: string;
    parentId?: number;
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

export abstract class IMutation {
    abstract createCategory(createCategoryInput?: CreateCategoryInput): Category | Promise<Category>;

    abstract createTag(createTagInput?: CreateTagInput): Tag | Promise<Tag>;
}

export abstract class IQuery {
    abstract getCategories(): Category[] | Promise<Category[]>;

    abstract category(id: string): Category | Promise<Category>;

    abstract getTags(): Tag[] | Promise<Tag[]>;

    abstract tag(id: string): Tag | Promise<Tag>;
}

export class Tag {
    id?: number;
    name?: string;
}
