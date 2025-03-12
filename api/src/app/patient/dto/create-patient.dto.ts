export class CreatePatientDto {
        id: number;
    

        cod_atendimento: number;
    
        name: string;
    
        cep: number
    
        rua: string;
    
        numero: number;
    
        bairro: string;
    
        cidade: string;
    
        estado: string;
    
        data_de_nascimento: Date;
    
        sexo: string;
    
        cartao_sus: number;
    
        cpf: string;
    
        name_da_mae: string;
    
        status: boolean;
}