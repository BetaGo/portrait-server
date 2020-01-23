
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class AddUserWordInput {
    word: string;
    translation?: string;
    example?: string;
}

export class UpdateUserWordInput {
    id: number;
    word?: string;
    translation?: string;
    example?: string;
    forgottenTimes?: number;
    rememberTimes?: number;
}

export class AddUserWordPayload {
    word: string;
    translation?: string;
    example?: string;
}

export class Geolocation {
    id: number;
    latitude: number;
    longitude: number;
    altitude: number;
    time: Date;
}

export abstract class IMutation {
    abstract createGeolocation(latitude: number, longitude: number, altitude: number, time: Date): Geolocation | Promise<Geolocation>;

    abstract addUserWord(input: AddUserWordInput): AddUserWordPayload | Promise<AddUserWordPayload>;

    abstract updateUserWord(input: UpdateUserWordInput): UpdateUserWordPayload | Promise<UpdateUserWordPayload>;
}

export class NewWordsResultCursor {
    edges: UserWordsEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}

export class PageInfo {
    endCursor?: string;
    hasNextPage: boolean;
}

export abstract class IQuery {
    abstract getGeolocation(from?: Date, to?: Date): Geolocation[] | Promise<Geolocation[]>;

    abstract geolocation(): Geolocation | Promise<Geolocation>;

    abstract user(): User | Promise<User>;

    abstract userWord(word: string): UserWord | Promise<UserWord>;

    abstract allUserWords(first: number, after?: string): UserWordsResultCursor | Promise<UserWordsResultCursor>;

    abstract allNewWords(first: number, after?: string): NewWordsResultCursor | Promise<NewWordsResultCursor>;
}

export abstract class ISubscription {
    abstract geolocationCreated(): Geolocation | Promise<Geolocation>;
}

export class UpdateUserWordPayload {
    success: boolean;
    message?: string;
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

export class UserWord {
    id: number;
    word: string;
    translation?: string;
    example?: string;
    forgottenTimes: number;
    rememberTimes: number;
}

export class UserWordsEdge {
    cursor: string;
    node: UserWord;
}

export class UserWordsResultCursor {
    edges: UserWordsEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}
