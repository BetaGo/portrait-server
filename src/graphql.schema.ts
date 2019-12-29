
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class Geolocation {
    id: number;
    latitude: number;
    longitude: number;
    altitude: number;
    time: Date;
}

export class Murmur {
    id: number;
    text: string;
    time: Date;
}

export abstract class IMutation {
    abstract createGeolocation(latitude: number, longitude: number, altitude: number, time: Date): Geolocation | Promise<Geolocation>;

    abstract createMurmur(text: string): Murmur | Promise<Murmur>;
}

export abstract class IQuery {
    abstract getGeolocation(from?: Date, to?: Date): Geolocation[] | Promise<Geolocation[]>;

    abstract geolocation(): Geolocation | Promise<Geolocation>;

    abstract user(): User | Promise<User>;
}

export abstract class ISubscription {
    abstract geolocationCreated(): Geolocation | Promise<Geolocation>;
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
