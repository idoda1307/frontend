import { LoginProvider } from "./login-provider";
import { SocialUser } from './user';
export declare abstract class BaseLoginProvider implements LoginProvider {
    constructor();
    abstract initialize(): Promise<SocialUser>;
    abstract signIn(): Promise<SocialUser>;
    abstract signOut(): Promise<any>;
    loadScript(id: string, src: string, onload: any, async?: boolean, inner_text_content?: string): void;
}
