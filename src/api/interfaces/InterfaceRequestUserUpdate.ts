export default interface InterfaceRequestUserUpdate {
	name: string;
	cpf: string;
	birth: Date;
	cep: string;
	email: string;
	password: string;
	qualified?: boolean;
	neighbordhood?: string;
	street?: string;
	complement?: string;
	city?: string;
	uf?: string;
	tokenUser: string;
    id: number;
}
