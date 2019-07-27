
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CreateTagInput {
    name: string;
    parentId?: number;
}

export abstract class IMutation {
    abstract createTag(createTagInput?: CreateTagInput): Tag | Promise<Tag>;
}

export abstract class IQuery {
    abstract getTags(): Tag[] | Promise<Tag[]>;

    abstract tag(id: string): Tag | Promise<Tag>;
}

export class Tag {
    id?: number;
    name?: string;
    parentId?: number;
}
