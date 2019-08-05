
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CreateActionInput {
    name: string;
    value: number;
    tagIds: number[];
    categoryId: number;
    description?: string;
    date: Date;
}

export class CreateCategoryInput {
    name: string;
    parentId?: number;
}

export class CreateTagInput {
    name: string;
}

export class Action {
    id: number;
    name: string;
    value: number;
    tags: Tag[];
    category: Category;
    description?: string;
    userId: number;
    date: Date;
}

export class Category {
    id?: number;
    name?: string;
    userId?: number;
    parentId?: number;
}

export abstract class IMutation {
    abstract createAction(createActionInput?: CreateActionInput): Action | Promise<Action>;

    abstract createCategory(createCategoryInput?: CreateCategoryInput): Category | Promise<Category>;

    abstract createTag(createTagInput?: CreateTagInput): Tag | Promise<Tag>;
}

export abstract class IQuery {
    abstract getActions(): Action[] | Promise<Action[]>;

    abstract action(id: string): Action | Promise<Action>;

    abstract getCategories(pageSize?: number, keyword?: string, cursor?: number): Category[] | Promise<Category[]>;

    abstract category(id: string): Category | Promise<Category>;

    abstract getTags(): Tag[] | Promise<Tag[]>;

    abstract tag(id: string): Tag | Promise<Tag>;
}

export class Tag {
    id: number;
    name: string;
}
