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
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.appdata',
                'https://www.googleapis.com/auth/drive.metadata',
                'https://www.googleapis.com/auth/drive.install',
                'https://www.googleapis.com/auth/drive.file',
                'email', 
                'profile'
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
                "https://www.googleapis.com/auth/gmail.send",
                "https://www.googleapis.com/auth/gmail.compose",
                "https://www.googleapis.com/auth/gmail.modify",
                "https://www.googleapis.com/auth/gmail.labels", 
                'https://mail.google.com/', 
                'email', 
                'profile'
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
            scopes: [
                'https://www.googleapis.com/auth/classroom.courses',
                'https://www.googleapis.com/auth/classroom.announcements',
                'https://www.googleapis.com/auth/classroom.topics',
                'https://www.googleapis.com/auth/classroom.courseworkmaterials',
                'https://www.googleapis.com/auth/classroom.coursework.me',
                'https://www.googleapis.com/auth/classroom.coursework.students',
                'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
                'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
                'https://www.googleapis.com/auth/classroom.rosters',
                'https://www.googleapis.com/auth/classroom.profile.emails',
                'email',
                'profile',
            ]
        }
    }
    
    createGoogleFormCredential(connection: Connection) : GoogleRobotCredentialJSONDTO {
        return {
            access_token: connection.accessToken,
            refresh_token: connection.refreshToken,
            client_id: process.env["GOOGLE_FORMS_CLIENT_ID"],
            client_secret: process.env["GOOGLE_FORMS_CLIENT_SECRET"],
            token_uri: "https://oauth2.googleapis.com/token",
            scopes: [
                'https://www.googleapis.com/auth/forms.body', 
                'https://www.googleapis.com/auth/forms.responses.readonly',
                'https://www.googleapis.com/auth/drive',
                'email', 
                'profile',
            ]
        }
    }

    createGoogleSheetsCredential(connection: Connection) : GoogleRobotCredentialJSONDTO {
        return {
            access_token: connection.accessToken,
            refresh_token: connection.refreshToken,
            client_id: process.env["GOOGLE_SHEETS_CLIENT_ID"],
            client_secret: process.env["GOOGLE_SHEETS_CLIENT_SECRET"],
            token_uri: "https://oauth2.googleapis.com/token",
            scopes: ['https://www.googleapis.com/auth/spreadsheets', 'email', 'profile']
        }
    }

}