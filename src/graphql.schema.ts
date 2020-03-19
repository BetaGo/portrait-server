
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class AddUserInput {
    username: string;
    displayName: string;
    password: string;
    email?: string;
    avatar?: string;
    phone?: string;
    token: string;
}

export class AddUserWordInput {
    word: string;
    translation?: string;
    example?: string;
}

export class RefreshTokenInput {
    refreshToken: string;
    accessToken: string;
}

export class UpdateUserInput {
    displayName?: string;
    email?: string;
    avatar?: string;
    phone?: string;
}

export class UpdateUserWordInput {
    id: number;
    word?: string;
    translation?: string;
    example?: string;
    forgottenTimes?: number;
    rememberTimes?: number;
}

export class UserLoginInput {
    account: string;
    password: string;
    token: string;
}

export class AddUserPayload {
    id: number;
    accessToken: string;
    refreshToken: string;
}

export class AddUserWordPayload {
    id: number;
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

export class LoginTokenPayload {
    token: string;
}

export abstract class IMutation {
    abstract createGeolocation(latitude: number, longitude: number, altitude: number, time: Date): Geolocation | Promise<Geolocation>;

    abstract addUser(input?: AddUserInput): AddUserPayload | Promise<AddUserPayload>;

    abstract updateUser(input?: UpdateUserInput): UpdateResult | Promise<UpdateResult>;

    abstract addUserWord(input: AddUserWordInput): AddUserWordPayload | Promise<AddUserWordPayload>;

    abstract updateUserWord(input: UpdateUserWordInput): UpdateResult | Promise<UpdateResult>;
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

    abstract userLogin(input?: UserLoginInput): UserLoginPayload | Promise<UserLoginPayload>;

    abstract userWord(word: string): UserWord | Promise<UserWord>;

    abstract allUserWords(first: number, after?: string): UserWordsResultCursor | Promise<UserWordsResultCursor>;

    abstract allNewWords(first: number, after?: string): NewWordsResultCursor | Promise<NewWordsResultCursor>;

    abstract refreshToken(input?: RefreshTokenInput): RefreshTokenPayload | Promise<RefreshTokenPayload>;

    abstract loginToken(): LoginTokenPayload | Promise<LoginTokenPayload>;
}

export class RefreshTokenPayload {
    refreshToken: string;
    accessToken: string;
}

export abstract class ISubscription {
    abstract geolocationCreated(): Geolocation | Promise<Geolocation>;
}

export class UpdateResult {
    success: boolean;
    message?: string;
}

export class User {
    id: number;
    thirdLoginId?: string;
    username?: string;
    displayName: string;
    email?: string;
    avatar?: string;
    ThirdLoginType?: string;
    phone?: string;
}

export class UserLoginPayload {
    accessToken: string;
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
