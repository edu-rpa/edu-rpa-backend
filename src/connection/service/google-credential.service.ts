import { Injectable } from "@nestjs/common";
import { ICredentialService } from "./credential.service";
import { AuthorizationProvider, Connection } from "../entity";
import { GoogleRobotCredentialJSONDTO } from "../dto/robot-credential.dto";

@Injectable()
export class GoogleCredentialService implements ICredentialService {
    constructor() {}

    create(connection: Connection) {
        switch(connection.provider) {
            case AuthorizationProvider.G_DRIVE:
                return this.createGoogleDriveCredential(connection)
            case AuthorizationProvider.G_GMAIL:
                return this.createGmailCredential(connection)
            case AuthorizationProvider.G_CLASSROOM:
                return this.createGoogleClassroomCredential(connection)
            case AuthorizationProvider.G_FORMS:
                return this.createGoogleFormCredential(connection)
            case AuthorizationProvider.G_SHEETS:
                return this.createGoogleFormCredential(connection)
        }
    }

    createGoogleDriveCredential(connection: Connection) : GoogleRobotCredentialJSONDTO {
        return {
            access_token: connection.accessToken,
            refresh_token: connection.refreshToken,
            client_id: process.env["GOOGLE_DRIVE_CLIENT_ID"],
            client_secret: process.env["GOOGLE_DRIVE_CLIENT_SECRET"],
            token_uri: "https://oauth2.googleapis.com/token",
            scopes: [
                "https://www.googleapis.com/auth/drive",
                "email",
                "profile"
            ]
        }
    }

    createGmailCredential(connection: Connection) : GoogleRobotCredentialJSONDTO {
        return {
            access_token: connection.accessToken,
            refresh_token: connection.refreshToken,
            client_id: process.env["GMAIL_CLIENT_ID"],
            client_secret: process.env["GMAIL_CLIENT_SECRET"],
            token_uri: "https://oauth2.googleapis.com/token",
            scopes: [
                "https://mail.google.com/"
            ]
        }
    }

    createGoogleClassroomCredential(connection: Connection) : GoogleRobotCredentialJSONDTO {
        return {
            access_token: connection.accessToken,
            refresh_token: connection.refreshToken,
            client_id: process.env["GOOGLE_CLASSROOM_CLIENT_ID"],
            client_secret: process.env["GOOGLE_CLASSROOM_CLIENT_SECRET"],
            token_uri: "https://oauth2.googleapis.com/token",
            scopes: []
        }
    }
    
    createGoogleFormCredential(connection: Connection) : GoogleRobotCredentialJSONDTO {
        return {
            access_token: connection.accessToken,
            refresh_token: connection.refreshToken,
            client_id: process.env["GOOGLE_FORMS_CLIENT_ID"],
            client_secret: process.env["GOOGLE_FORMS_CLIENT_SECRET"],
            token_uri: "https://oauth2.googleapis.com/token",
            scopes: []
        }
    }

    createGoogleSheetsCredential(connection: Connection) : GoogleRobotCredentialJSONDTO {
        return {
            access_token: connection.accessToken,
            refresh_token: connection.refreshToken,
            client_id: process.env["GOOGLE_SHEETS_CLIENT_ID"],
            client_secret: process.env["GOOGLE_SHEETS_CLIENT_SECRET"],
            token_uri: "https://oauth2.googleapis.com/token",
            scopes: []
        }
    }

}