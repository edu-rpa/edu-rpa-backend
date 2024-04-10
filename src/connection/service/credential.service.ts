import { Connection } from "../entity/connection.entity";


export interface ICredentialService {
    create(connection: Connection) : any
}