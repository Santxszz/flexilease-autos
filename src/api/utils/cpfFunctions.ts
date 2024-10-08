import AppError from "@api/middlewares/AppError"

export default async function cpfFormater(cpf: string) {
    const cpfFormated = cpf.replace(/\D/g, '')
    if(cpfFormated.length !== 11) {
        throw new AppError("CPF is Invalid!", 400)
    } 
    return cpfFormated
}