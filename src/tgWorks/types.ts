import { Context, Scenes } from "telegraf";



export interface UserWizardSession extends Scenes.WizardSessionData {
	// will be available under `ctx.scene.session.myWizardSessionProp`
	step: number;
    state: any
}

export interface MySession extends Scenes.WizardSession<UserWizardSession> {
    // user?: User;
    isNew?: boolean
    selectedLanguage?: boolean
 }
 
 /**
 * We can define our own context object.
 *
 * As always, if we also want to use our own session object, we have to set it
 * here under the `session` property. In addition, we now also have to set the
 * scene object under the `scene` property. As we're using wizards, we have to
 * pass `WizardSessionData` to the scene object.
 *
 * We also have to set the wizard object under the `wizard` property.
 */
 export interface UserSessionContext extends Context {
    // will be available under `ctx.myContextProp`
 //    myContextProp: string;
 
    // declare session type
    session: MySession;
    // declare scene type
    scene: Scenes.SceneContextScene<UserSessionContext, UserWizardSession>;
    // declare wizard type
    wizard: Scenes.WizardContextWizard<UserSessionContext>;
 }
 
