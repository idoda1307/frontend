import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/user';
export declare class LinkedInLoginProvider extends BaseLoginProvider {
    private clientId;
    private authorize;
    private lang;
    static readonly PROVIDER_ID: string;
    constructor(clientId: string, authorize?: boolean, lang?: string);
    initialize(): Promise<SocialUser>;
    signIn(): Promise<SocialUser>;
    signOut(): Promise<any>;
}
